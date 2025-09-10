import { z } from 'zod';

export const updateProgressSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  lessonId: z.string().min(1, 'Lesson ID is required'),
  completed: z.boolean().default(false),
  score: z.number().min(0).max(100).optional(),
});

export const createProgressSchema = updateProgressSchema.extend({
  attempts: z.number().min(1).default(1),
});

export const progressFilterSchema = z.object({
  userId: z.string().optional(),
  lessonId: z.string().optional(),
  completed: z.boolean().optional(),
});

export const updateUserStatsSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  streakDays: z.number().min(0).optional(),
  totalLessonsCompleted: z.number().min(0).optional(),
  totalWordsLearned: z.number().min(0).optional(),
  currentLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  lastPracticeDate: z.date().optional(),
});