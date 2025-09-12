import type { LanguageKey } from '@/features/language/config/language.schema';

// Client-side service for making API calls
export class DashboardServiceClient {
  static async getUserDashboardData(targetLanguage: LanguageKey) {
    try {
      const response = await fetch(`/api/v1/dashboard?targetLanguage=${targetLanguage}`);

      if (!response.ok) {
        if (response.status === 401) {
          return { success: false, error: 'Unauthorized' };
        }
        throw new Error('Failed to fetch dashboard data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return { success: false, error: 'Failed to fetch dashboard data' };
    }
  }

  static async getRecommendedModules(targetLanguage: LanguageKey) {
    try {
      const response = await fetch(`/api/v1/dashboard/recommended-modules?targetLanguage=${targetLanguage}`);

      if (!response.ok) {
        throw new Error('Failed to fetch recommended modules');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching recommended modules:', error);
      return { success: false, error: 'Failed to fetch recommended modules' };
    }
  }
}