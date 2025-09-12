import { db } from '@/drizzle/db';
import { users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import type { LanguageSelection } from '../config/language.schema';

export class LanguageService {
  static async updateUserLanguagePreferences(userId: string, preferences: LanguageSelection) {
    try {
      const result = await db
        .update(users)
        .set({
          nativeLanguage: preferences.nativeLanguage,
          targetLanguages: JSON.stringify([preferences.targetLanguage]), // Store as array for future multi-language support
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();

      return { success: true, user: result[0] };
    } catch (error) {
      console.error('Error updating user language preferences:', error);
      return { success: false, error: 'Failed to update language preferences' };
    }
  }

  static async getUserLanguagePreferences(userId: string) {
    try {
      const user = await db
        .select({
          nativeLanguage: users.nativeLanguage,
          targetLanguages: users.targetLanguages,
          currentLevel: users.currentLevel,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user[0]) {
        return { success: false, error: 'User not found' };
      }

      const targetLanguages = user[0].targetLanguages 
        ? JSON.parse(user[0].targetLanguages) 
        : [];

      return {
        success: true,
        preferences: {
          nativeLanguage: user[0].nativeLanguage,
          targetLanguage: targetLanguages[0], // Primary target language
          currentLevel: user[0].currentLevel,
        },
      };
    } catch (error) {
      console.error('Error fetching user language preferences:', error);
      return { success: false, error: 'Failed to fetch language preferences' };
    }
  }
}