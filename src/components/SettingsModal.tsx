import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'default') => {
    try {
      await setTheme(newTheme);
    } catch (error) {
      console.error('Failed to update theme:', error);
      alert('Failed to update theme. Please try again.');
    }
  };

  const handleDeleteChats = async () => {
    if (!user) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to delete all your chat history? This action cannot be undone.'
    );
    
    if (confirmed) {
      try {
        // Delete all conversations for the user
        const { error } = await supabase
          .from('conversations')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;

        // Close modal and reload page to refresh the chat history
        onClose();
        window.location.reload();
      } catch (error) {
        console.error('Failed to delete chats:', error);
        alert('Failed to delete chat history. Please try again.');
      }
    }
  };

  // Handle clicking outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Settings</h2>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</h3>
          <div className="space-y-2">
            {(['light', 'dark', 'default'] as const).map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => handleThemeChange(themeOption)}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  theme === themeOption
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'hover:bg-gray-100 text-gray-700 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Chat History</h3>
          <button
            onClick={handleDeleteChats}
            className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          >
            Delete All Chats
          </button>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal