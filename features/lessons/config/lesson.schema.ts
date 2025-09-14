import { z } from 'zod';

export const lessonContentSchema = z.object({
  text: z.string().min(1, 'Content text is required'),
  examples: z.array(z.string()).optional(),
  vocabulary: z.array(z.object({
    word: z.string(),
    translation: z.string(),
    pronunciation: z.string().optional(),
  })).optional(),
  grammarRules: z.array(z.string()).optional(),
});

export const createLessonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  language: z.enum(['spanish', 'french', 'german', 'italian', 'portuguese', 'japanese', 'chinese', 'english']),
  type: z.enum(['vocabulary', 'grammar', 'phrases', 'pronunciation', 'listening', 'reading']),
  content: lessonContentSchema,
  audioUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  estimatedDuration: z.number().min(1).default(5),
  pointsReward: z.number().min(0).default(10),
  order: z.number().default(0),
  prerequisites: z.array(z.string().uuid()).optional(),
  tags: z.array(z.string()).optional(),
});

export const updateLessonSchema = createLessonSchema.partial().extend({
  id: z.string(),
});

export const lessonFilterSchema = z.object({
  language: z.enum(['spanish', 'french', 'german', 'italian', 'portuguese', 'japanese', 'chinese', 'english']).optional(),
  type: z.enum(['vocabulary', 'grammar', 'phrases', 'pronunciation', 'listening', 'reading']).optional(),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  isActive: z.boolean().optional(),
});