import * as tf from '@tensorflow/tfjs';
import { load } from '@tensorflow-models/universal-sentence-encoder';

let model: any = null;

export const loadModel = async () => {
  if (!model) {
    model = await load();
  }
  return model;
};

export const getTextEmbedding = async (text: string) => {
  const model = await loadModel();
  const embedding = await model.embed([text]);
  return await embedding.array();
};

export const cosineSimilarity = (a: number[], b: number[]): number => {
  const dotProduct = a.reduce((acc, val, i) => acc + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((acc, val) => acc + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

export const analyzeSymptoms = async (symptoms: string) => {
  const embedding = await getTextEmbedding(symptoms);
  return embedding[0];
};