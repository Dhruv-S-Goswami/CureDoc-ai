import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type Theme = 'light' | 'dark' | 'default';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('default');

  useEffect(() => {
    // Load theme from user profile
    const loadTheme = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('theme')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error loading theme:', error);
            return;
          }
          
          if (data?.theme) {
            setThemeState(data.theme as Theme);
            applyTheme(data.theme as Theme);
          }
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    
    loadTheme();
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    if (newTheme !== 'default') {
      root.classList.add(newTheme);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('user_profiles')
        .update({ theme: newTheme })
        .eq('id', user.id);

      if (error) throw error;
      
      setThemeState(newTheme);
      applyTheme(newTheme);
    } catch (error) {
      console.error('Error setting theme:', error);
      throw error;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};