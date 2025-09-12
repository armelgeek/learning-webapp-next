'use client';

import { useState, useEffect } from 'react';
import { LanguageServiceClient } from '../domain/client.service';
import type { LanguageKey } from '../config/language.schema';

export function useUserLanguagePreferences(userId: string | undefined) {
  const [preferences, setPreferences] = useState<{
    nativeLanguage: LanguageKey | null;
    targetLanguage: LanguageKey | null;
    currentLevel: 'beginner' | 'intermediate' | 'advanced' | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const result = await LanguageServiceClient.getUserLanguagePreferences();
        
        if (result.success && result.preferences) {
          setPreferences(result.preferences);
        } else {
          setPreferences(null);
          setError(result.error || 'Failed to load preferences');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Error fetching language preferences:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, [userId]);

  const updatePreferences = async (newPreferences: { nativeLanguage: LanguageKey; targetLanguage: LanguageKey }) => {
    if (!userId) return { success: false, error: 'User ID required' };

    try {
      const result = await LanguageServiceClient.updateUserLanguagePreferences(newPreferences);
      
      if (result.success) {
        setPreferences({
          nativeLanguage: newPreferences.nativeLanguage,
          targetLanguage: newPreferences.targetLanguage,
          currentLevel: preferences?.currentLevel || 'beginner',
        });
      }
      
      return result;
    } catch (error) {
      return { success: false, error: 'Failed to update preferences' };
    }
  };

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    hasPreferences: !!preferences?.targetLanguage,
  };
}