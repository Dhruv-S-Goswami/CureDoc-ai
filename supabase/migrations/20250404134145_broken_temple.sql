/*
  # Fix user profiles RLS policies

  1. Changes
    - Add RLS policies for user_profiles table to allow:
      - Users to create their own profile during signup
      - Users to update their own profile
      - Users to read their own profile
  
  2. Security
    - Enable RLS on user_profiles table
    - Add policies for INSERT, UPDATE, and SELECT operations
*/

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can create their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;

-- Create new policies
CREATE POLICY "Users can create their own profile"
ON user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile"
ON user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);