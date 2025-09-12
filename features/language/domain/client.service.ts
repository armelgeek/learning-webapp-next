import type { LanguageSelection } from '../config/language.schema';

// Client-side service for making API calls
export class LanguageServiceClient {
  static async updateUserLanguagePreferences(preferences: LanguageSelection) {
    try {
      const response = await fetch('/api/v1/language/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user language preferences:', error);
      return { success: false, error: 'Failed to update language preferences' };
    }
  }

  static async getUserLanguagePreferences() {
    try {
      const response = await fetch('/api/v1/language/preferences');

      if (!response.ok) {
        if (response.status === 401) {
          return { success: false, error: 'Unauthorized' };
        }
        throw new Error('Failed to fetch preferences');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user language preferences:', error);
      return { success: false, error: 'Failed to fetch language preferences' };
    }
  }
}