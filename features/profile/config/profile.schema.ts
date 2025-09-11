import { z } from 'zod';

// Available languages (matching database enum)
export const languages = [
  'spanish', 'french', 'german', 'italian', 'portuguese', 'japanese', 'chinese', 'english'
] as const;

export const difficultyLevels = ['beginner', 'intermediate', 'advanced'] as const;

// User profile update schema
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  age: z.number().min(13, 'Must be at least 13 years old').max(120).optional(),
  nativeLanguage: z.enum(languages).optional(),
  targetLanguages: z.array(z.enum(languages)).min(1, 'Select at least one target language').max(5, 'Maximum 5 target languages'),
  currentLevel: z.enum(difficultyLevels).optional(),
  learningGoal: z.string().max(500, 'Learning goal must be less than 500 characters').optional(),
  bio: z.string().max(300, 'Bio must be less than 300 characters').optional(),
  country: z.string().max(100).optional(),
  timezone: z.string().max(50).optional(),
});

// Learning goals update schema
export const updateLearningGoalsSchema = z.object({
  dailyGoal: z.number().min(5, 'Daily goal must be at least 5 minutes').max(180, 'Daily goal cannot exceed 3 hours'),
  weeklyGoal: z.number().min(30, 'Weekly goal must be at least 30 minutes').max(1260, 'Weekly goal cannot exceed 21 hours'),
  learningGoal: z.string().max(500, 'Learning goal must be less than 500 characters').optional(),
});

// Language preferences
export const languagePreferencesSchema = z.object({
  nativeLanguage: z.enum(languages),
  targetLanguages: z.array(z.enum(languages)).min(1, 'Select at least one target language').max(5),
  currentLevel: z.enum(difficultyLevels),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateLearningGoalsInput = z.infer<typeof updateLearningGoalsSchema>;
export type LanguagePreferencesInput = z.infer<typeof languagePreferencesSchema>;