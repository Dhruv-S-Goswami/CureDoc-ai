import { Hono } from 'npm:hono@4.0.5'
import { cors } from 'npm:hono@4.0.5/cors'
import { createClient } from 'npm:@supabase/supabase-js@2.39.7'
import { load } from 'npm:@tensorflow-models/universal-sentence-encoder'

const app = new Hono()

app.use('/*', cors({
  origin: '*',
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}))

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

// Load Universal Sentence Encoder model
let model: any = null;

const loadModel = async () => {
  if (!model) {
    model = await load();
  }
  return model;
};

// Symptom database for matching
const symptomsDB = [
  {
    symptoms: ['headache', 'migraine', 'head pain'],
    condition: 'Headache/Migraine',
    response: "Based on your symptoms, you may be experiencing a headache or migraine. Common causes include stress, dehydration, lack of sleep, or tension. For occasional headaches, try:\n\n1. Rest in a quiet, dark room\n2. Stay hydrated\n3. Over-the-counter pain relievers\n4. Apply cold or warm compress\n\nIf you experience severe, persistent, or unusual headaches, please consult a healthcare provider.",
    confidence: 0.85
  },
  {
    symptoms: ['fever', 'high temperature', 'chills'],
    condition: 'Fever',
    response: "Your symptoms suggest you have a fever, which is often a sign your body is fighting an infection. Recommendations:\n\n1. Rest and stay hydrated\n2. Take fever-reducing medications if needed\n3. Monitor your temperature\n4. Use light clothing and bedding\n\nSeek immediate medical attention if:\n- Temperature exceeds 103°F/39.4°C\n- Fever lasts more than 3 days\n- You have severe symptoms",
    confidence: 0.8
  },
  {
    symptoms: ['cough', 'cold', 'flu', 'sore throat'],
    condition: 'Upper Respiratory Infection',
    response: "Your symptoms align with an upper respiratory infection (common cold or flu). Recommended actions:\n\n1. Rest and get adequate sleep\n2. Stay hydrated with water and warm liquids\n3. Use over-the-counter cold medications\n4. Consider using a humidifier\n\nMost people recover within 7-10 days. Consult a healthcare provider if symptoms are severe or persist longer.",
    confidence: 0.75
  }
];

// Function to calculate cosine similarity
const cosineSimilarity = (a: number[], b: number[]): number => {
  const dotProduct = a.reduce((acc, val, i) => acc + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((acc, val) => acc + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

// Disease Prediction Endpoint with NLP
app.post('/predict-disease', async (c) => {
  try {
    const { symptoms } = await c.req.json();
    const model = await loadModel();
    
    // Encode user input
    const userEmbedding = await model.embed(symptoms);
    const userVector = await userEmbedding.array();

    // Find best matching condition
    let bestMatch = {
      condition: '',
      response: '',
      confidence: 0,
      symptoms: []
    };

    for (const entry of symptomsDB) {
      // Encode each symptom set
      const symptomEmbedding = await model.embed(entry.symptoms);
      const symptomVector = await symptomEmbedding.array();

      // Calculate similarity
      const similarity = cosineSimilarity(userVector[0], symptomVector[0]);

      if (similarity > bestMatch.confidence) {
        bestMatch = {
          ...entry,
          confidence: similarity
        };
      }
    }

    // If no good match found, provide general response
    if (bestMatch.confidence < 0.3) {
      bestMatch = {
        condition: 'Unspecified',
        response: "I understand you're not feeling well. While I can provide general health information, it's important to consult with a healthcare professional for personalized medical advice. Could you provide more details about your symptoms?",
        confidence: 0.2,
        symptoms: []
      };
    }

    // Store the prediction in Supabase
    await supabase
      .from('disease_predictions')
      .insert({
        user_id: c.req.header('user-id'),
        symptoms: Array.isArray(symptoms) ? symptoms : [symptoms],
        prediction: bestMatch.condition,
        confidence: bestMatch.confidence
      });

    return c.json({
      condition: bestMatch.condition,
      response: bestMatch.response,
      confidence: bestMatch.confidence
    });
  } catch (error) {
    console.error('Error in disease prediction:', error);
    return c.json({ error: 'Failed to predict disease' }, 500);
  }
});

// Doctor Recommendation Endpoint with ML-based matching
app.post('/recommend-doctors', async (c) => {
  try {
    const { specialization, location, symptoms } = await c.req.json();
    const model = await loadModel();

    // Encode user symptoms for matching
    const symptomsEmbedding = await model.embed(symptoms);
    const symptomsVector = await symptomsEmbedding.array();

    // Mock doctor database with specializations
    const doctors = [
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        specialization: 'General Medicine',
        expertise: ['headaches', 'fever', 'general wellness'],
        experience: '15 years',
        rating: 4.8,
        location: 'New York',
        available_slots: ['2024-03-20 10:00', '2024-03-20 14:00']
      },
      {
        id: 2,
        name: 'Dr. Michael Chen',
        specialization: 'Internal Medicine',
        expertise: ['respiratory issues', 'chronic conditions'],
        experience: '12 years',
        rating: 4.7,
        location: 'New York',
        available_slots: ['2024-03-21 11:00', '2024-03-21 15:00']
      }
    ];

    // Match doctors based on expertise and symptoms
    const rankedDoctors = await Promise.all(doctors.map(async (doctor) => {
      const expertiseEmbedding = await model.embed(doctor.expertise);
      const expertiseVector = await expertiseEmbedding.array();
      const relevanceScore = cosineSimilarity(symptomsVector[0], expertiseVector[0]);
      return { ...doctor, relevanceScore };
    }));

    // Sort doctors by relevance score
    rankedDoctors.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return c.json(rankedDoctors);
  } catch (error) {
    console.error('Error in doctor recommendations:', error);
    return c.json({ error: 'Failed to fetch doctor recommendations' }, 500);
  }
});

// Enhanced Lifestyle Suggestions with ML-based personalization
app.post('/suggest-lifestyle', async (c) => {
  try {
    const { condition, preferences, symptoms } = await c.req.json();
    const model = await loadModel();

    // Encode user input for matching
    const userInputEmbedding = await model.embed([condition, ...symptoms]);
    const userVector = await userInputEmbedding.array();

    // Lifestyle suggestion database
    const lifestyleSuggestions = [
      {
        conditions: ['headache', 'migraine'],
        suggestions: {
          diet: [
            {
              type: 'Meal Plan',
              recommendations: [
                'Avoid trigger foods (e.g., caffeine, alcohol)',
                'Stay hydrated with water',
                'Eat regular, balanced meals'
              ]
            }
          ],
          exercise: [
            {
              type: 'Physical Activity',
              recommendations: [
                'Gentle yoga or stretching',
                'Regular walks in fresh air',
                'Avoid high-intensity workouts during episodes'
              ]
            }
          ],
          lifestyle: [
            {
              type: 'Daily Habits',
              recommendations: [
                'Maintain regular sleep schedule',
                'Practice stress management',
                'Limit screen time'
              ]
            }
          ]
        }
      },
      // Add more condition-specific suggestions
    ];

    // Find best matching suggestions
    let bestMatch = null;
    let highestSimilarity = 0;

    for (const suggestion of lifestyleSuggestions) {
      const suggestionEmbedding = await model.embed(suggestion.conditions);
      const suggestionVector = await suggestionEmbedding.array();
      const similarity = cosineSimilarity(userVector[0], suggestionVector[0]);

      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        bestMatch = suggestion.suggestions;
      }
    }

    // Use default suggestions if no good match found
    if (!bestMatch) {
      bestMatch = {
        diet: [
          {
            type: 'General Nutrition',
            recommendations: [
              'Eat a balanced diet',
              'Stay hydrated',
              'Include fruits and vegetables'
            ]
          }
        ],
        exercise: [
          {
            type: 'General Activity',
            recommendations: [
              'Regular moderate exercise',
              'Daily walking',
              'Stretching exercises'
            ]
          }
        ],
        lifestyle: [
          {
            type: 'Healthy Habits',
            recommendations: [
              'Regular sleep schedule',
              'Stress management',
              'Regular breaks during work'
            ]
          }
        ]
      };
    }

    // Store the suggestions in Supabase
    await supabase
      .from('lifestyle_suggestions')
      .insert({
        user_id: c.req.header('user-id'),
        condition,
        suggestions: bestMatch
      });

    return c.json(bestMatch);
  } catch (error) {
    console.error('Error in lifestyle suggestions:', error);
    return c.json({ error: 'Failed to generate lifestyle suggestions' }, 500);
  }
});

// Enhanced Conversation Management with NLP
app.post('/conversations', async (c) => {
  try {
    const { message } = await c.req.json();
    const userId = c.req.header('user-id');
    const model = await loadModel();

    // Analyze message sentiment and context
    const messageEmbedding = await model.embed([message]);
    const messageVector = await messageEmbedding.array();

    // Store the conversation with enhanced metadata
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        message,
        metadata: {
          embedding: Array.from(messageVector[0]),
          timestamp: new Date().toISOString()
        }
      })
      .select();

    if (error) throw error;

    return c.json(data[0]);
  } catch (error) {
    console.error('Error in conversation management:', error);
    return c.json({ error: 'Failed to save conversation' }, 500);
  }
});

app.get('/conversations', async (c) => {
  try {
    const userId = c.req.header('user-id');
    
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) throw error;

    return c.json(data);
  } catch (error) {
    console.error('Error in fetching conversations:', error);
    return c.json({ error: 'Failed to fetch conversations' }, 500);
  }
});

Deno.serve(app.fetch)