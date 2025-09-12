import { z } from 'zod';

// Available languages in the system
export const LANGUAGES = {
  spanish: { name: 'Spanish', flag: '🇪🇸', code: 'es' },
  french: { name: 'French', flag: '🇫🇷', code: 'fr' },
  german: { name: 'German', flag: '🇩🇪', code: 'de' },
  italian: { name: 'Italian', flag: '🇮🇹', code: 'it' },
  portuguese: { name: 'Portuguese', flag: '🇵🇹', code: 'pt' },
  japanese: { name: 'Japanese', flag: '🇯🇵', code: 'ja' },
  chinese: { name: 'Chinese', flag: '🇨🇳', code: 'zh' },
  english: { name: 'English', flag: '🇺🇸', code: 'en' },
} as const;

export type LanguageKey = keyof typeof LANGUAGES;

export const languageSelectSchema = z.object({
  nativeLanguage: z.enum(['spanish', 'french', 'german', 'italian', 'portuguese', 'japanese', 'chinese', 'english']),
  targetLanguage: z.enum(['spanish', 'french', 'german', 'italian', 'portuguese', 'japanese', 'chinese', 'english']),
});

export type LanguageSelection = z.infer<typeof languageSelectSchema>;

export const userLanguagePreferencesSchema = z.object({
  userId: z.string(),
  nativeLanguage: z.enum(['spanish', 'french', 'german', 'italian', 'portuguese', 'japanese', 'chinese', 'english']),
  targetLanguage: z.enum(['spanish', 'french', 'german', 'italian', 'portuguese', 'japanese', 'chinese', 'english']),
  currentLevel: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
});

export type UserLanguagePreferences = z.infer<typeof userLanguagePreferencesSchema>;