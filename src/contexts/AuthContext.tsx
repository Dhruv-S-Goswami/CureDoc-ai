import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      throw new Error('Email already registered. Please login instead.');
    }

    // Check if username already exists
    const { data: existingUsername } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (existingUsername) {
      throw new Error('Username already taken. Please choose another.');
    }

    // Sign up the user
    const { data: { user: newUser }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    });
    
    if (signUpError) throw signUpError;
    if (!newUser) throw new Error('Failed to create user');

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([{ 
        id: newUser.id,
        username, 
        email,
        theme: 'default'
      }]);
    
    if (profileError) throw profileError;
  };

  const signIn = async (identifier: string, password: string) => {
    try {
      // Check if identifier is an email
      const isEmail = identifier.includes('@');
      
      if (isEmail) {
        const { error } = await supabase.auth.signInWithPassword({
          email: identifier,
          password,
        });
        if (error) throw error;
      } else {
        // Login with username
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('email')
          .eq('username', identifier)
          .maybeSingle();
        
        if (profileError) throw profileError;
        if (!profile) throw new Error('Username not found');
        
        const { error } = await supabase.auth.signInWithPassword({
          email: profile.email,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to sign in');
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};