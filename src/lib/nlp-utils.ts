import { supabase } from './supabase';

interface NLPResponse {
  intent: string;
  symptoms: string[];
  confidence: number;
  raw_entities: any[];
}

export async function processText(text: string): Promise<NLPResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('nlp-processing', {
      body: JSON.stringify({ text })
    });

    if (error) throw error;
    return data as NLPResponse;
  } catch (error) {
    console.error('Error processing text:', error);
    throw error;
  }
}

export async function analyzeSymptomsWithNLP(symptoms: string[]): Promise<any> {
  try {
    const results = await Promise.all(
      symptoms.map(symptom => processText(symptom))
    );

    // Combine and deduplicate symptoms
    const uniqueSymptoms = new Set<string>();
    results.forEach(result => {
      result.symptoms.forEach(symptom => uniqueSymptoms.add(symptom));
    });

    // Calculate average confidence
    const avgConfidence = results.reduce((acc, curr) => acc + curr.confidence, 0) / results.length;

    return {
      symptoms: Array.from(uniqueSymptoms),
      confidence: avgConfidence,
      raw_results: results
    };
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw error;
  }
}

export async function predictDisease(symptoms: string[]): Promise<any> {
  try {
    const analysis = await analyzeSymptomsWithNLP(symptoms);
    
    const { data, error } = await supabase
      .from('disease_predictions')
      .insert({
        symptoms: analysis.symptoms,
        prediction: 'Pending ML model integration',
        confidence: analysis.confidence
      })
      .select()
      .single();

    if (error) throw error;

    return {
      prediction: data.prediction,
      confidence: data.confidence,
      symptoms: data.symptoms,
      analysis: analysis.raw_results
    };
  } catch (error) {
    console.error('Error predicting disease:', error);
    throw error;
  }
}