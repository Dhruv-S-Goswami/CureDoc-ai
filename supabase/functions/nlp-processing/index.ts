import { Hono } from 'npm:hono@4.0.5'
import { cors } from 'npm:hono@4.0.5/cors'
import { pipeline } from 'npm:@xenova/transformers@2.15.1'
import { createClient } from 'npm:@supabase/supabase-js@2.39.7'

const app = new Hono()

// Configure CORS
app.use('/*', cors({
  origin: '*',
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}))

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

// Initialize the pipeline
let classifier: any = null;
let tokenizer: any = null;

// Medical symptom keywords for better recognition
const symptomKeywords = [
  'pain', 'ache', 'sore', 'discomfort', 'fever', 'cough', 'headache',
  'nausea', 'vomiting', 'dizziness', 'fatigue', 'weakness', 'swelling',
  'rash', 'breathing', 'chest', 'stomach', 'back', 'joint', 'muscle'
];

const initializeModels = async () => {
  try {
    if (!classifier) {
      classifier = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
    }
    if (!tokenizer) {
      tokenizer = await pipeline('token-classification', 'Xenova/bert-base-NER');
    }
    return true;
  } catch (error) {
    console.error('Error initializing models:', error);
    return false;
  }
};

// Enhanced entity processing with medical context
function processEntities(entities: any[], text: string) {
  const symptoms: Set<string> = new Set();
  let currentSymptom = '';
  
  // Process named entities
  entities.forEach(entity => {
    if (entity.entity.includes('B-')) {
      if (currentSymptom) symptoms.add(currentSymptom.trim().toLowerCase());
      currentSymptom = entity.word;
    } else if (entity.entity.includes('I-')) {
      currentSymptom += ' ' + entity.word;
    }
  });
  
  if (currentSymptom) {
    symptoms.add(currentSymptom.trim().toLowerCase());
  }

  // Check for symptom keywords
  const words = text.toLowerCase().split(/\s+/);
  words.forEach(word => {
    if (symptomKeywords.includes(word)) {
      symptoms.add(word);
    }
  });

  // Look for common symptom phrases
  const phrases = text.toLowerCase().match(/([a-z]+\s){0,2}(pain|ache|sore|fever|cough)[a-z\s]*/g) || [];
  phrases.forEach(phrase => {
    symptoms.add(phrase.trim());
  });

  return Array.from(symptoms);
}

// Rate limiting implementation
const rateLimit = new Map<string, { count: number, timestamp: number }>();
const RATE_LIMIT = 100; // requests per minute
const RATE_WINDOW = 60000; // 1 minute in milliseconds

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userRate = rateLimit.get(userId);

  if (!userRate) {
    rateLimit.set(userId, { count: 1, timestamp: now });
    return true;
  }

  if (now - userRate.timestamp > RATE_WINDOW) {
    rateLimit.set(userId, { count: 1, timestamp: now });
    return true;
  }

  if (userRate.count >= RATE_LIMIT) {
    return false;
  }

  userRate.count++;
  return true;
}

// Error handling middleware
app.use('*', async (c, next) => {
  try {
    await next()
  } catch (err) {
    console.error('Error in middleware:', err)
    return c.json({
      error: 'Internal Server Error',
      message: err instanceof Error ? err.message : 'Unknown error occurred'
    }, 500)
  }
});

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// Main processing endpoint
app.post('/process', async (c) => {
  try {
    const userId = c.req.header('user-id');
    if (!userId) {
      return c.json({ error: 'User ID is required' }, 400);
    }

    // Check rate limit
    if (!checkRateLimit(userId)) {
      return c.json({ error: 'Rate limit exceeded' }, 429);
    }

    const { text } = await c.req.json();
    if (!text || typeof text !== 'string') {
      return c.json({ error: 'Invalid input: text is required and must be a string' }, 400);
    }

    // Initialize models if needed
    const modelsReady = await initializeModels();
    if (!modelsReady) {
      return c.json({ error: 'NLP models failed to initialize' }, 500);
    }

    // Classify the intent
    const sentimentResult = await classifier(text);
    
    // Extract entities
    const entityResult = await tokenizer(text);

    // Process entities to extract symptoms
    const symptoms = processEntities(entityResult, text);

    // Calculate confidence based on multiple factors
    const confidence = calculateConfidence(sentimentResult[0].score, symptoms.length);

    // Store the analysis in Supabase
    const { error: dbError } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        message: text,
        metadata: {
          intent: sentimentResult[0].label,
          symptoms,
          confidence,
          analysis_timestamp: new Date().toISOString()
        }
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue processing even if storage fails
    }

    return c.json({
      intent: sentimentResult[0].label,
      symptoms,
      confidence,
      timestamp: new Date().toISOString(),
      raw_entities: entityResult
    });
  } catch (error) {
    console.error('Error processing text:', error);
    return c.json({ 
      error: 'Failed to process text',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }, 500);
  }
});

// Helper function to calculate confidence score
function calculateConfidence(sentimentScore: number, symptomCount: number): number {
  // Base confidence from sentiment analysis
  let confidence = sentimentScore;

  // Adjust based on symptom count
  if (symptomCount > 0) {
    confidence = (confidence + Math.min(symptomCount / 5, 1)) / 2;
  }

  // Ensure confidence is between 0 and 1
  return Math.max(0, Math.min(1, confidence));
}

// Batch processing endpoint for multiple texts
app.post('/process-batch', async (c) => {
  try {
    const userId = c.req.header('user-id');
    if (!userId) {
      return c.json({ error: 'User ID is required' }, 400);
    }

    const { texts } = await c.req.json();
    if (!Array.isArray(texts)) {
      return c.json({ error: 'Invalid input: texts must be an array' }, 400);
    }

    // Initialize models if needed
    const modelsReady = await initializeModels();
    if (!modelsReady) {
      return c.json({ error: 'NLP models failed to initialize' }, 500);
    }

    const results = await Promise.all(texts.map(async (text) => {
      try {
        const sentimentResult = await classifier(text);
        const entityResult = await tokenizer(text);
        const symptoms = processEntities(entityResult, text);
        const confidence = calculateConfidence(sentimentResult[0].score, symptoms.length);

        return {
          text,
          intent: sentimentResult[0].label,
          symptoms,
          confidence,
          success: true
        };
      } catch (error) {
        return {
          text,
          error: 'Failed to process text',
          success: false
        };
      }
    }));

    return c.json({ results });
  } catch (error) {
    console.error('Error in batch processing:', error);
    return c.json({ 
      error: 'Failed to process batch',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }, 500);
  }
});

Deno.serve(app.fetch)