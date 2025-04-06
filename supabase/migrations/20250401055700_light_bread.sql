/*
  # Health-related tables for CureDoc.ai

  1. New Tables
    - disease_predictions
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - symptoms (text[])
      - prediction (text)
      - confidence (float)
      - created_at (timestamp with time zone)

    - conversations
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - message (text)
      - timestamp (timestamp with time zone)
      - metadata (jsonb)

    - lifestyle_suggestions
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - condition (text)
      - suggestions (jsonb)
      - created_at (timestamp with time zone)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Disease Predictions Table
CREATE TABLE IF NOT EXISTS disease_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  symptoms text[] NOT NULL,
  prediction text NOT NULL,
  confidence float NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE disease_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own predictions"
  ON disease_predictions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own predictions"
  ON disease_predictions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  message text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Lifestyle Suggestions Table
CREATE TABLE IF NOT EXISTS lifestyle_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  condition text NOT NULL,
  suggestions jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lifestyle_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own lifestyle suggestions"
  ON lifestyle_suggestions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lifestyle suggestions"
  ON lifestyle_suggestions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_disease_predictions_user_id ON disease_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_lifestyle_suggestions_user_id ON lifestyle_suggestions(user_id);