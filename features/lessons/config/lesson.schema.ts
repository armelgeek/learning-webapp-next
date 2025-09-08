import { z } from 'zod';

export const languageSchema = z.enum(['english', 'french', 'spanish', 'german', 'italian', 'portuguese']);
export const difficultySchema = z.enum(['beginner', 'intermediate', 'advanced']);
export const lessonTypeSchema = z.enum(['vocabulary', 'grammar', 'phrases', 'conversation']);

export const lessonContentSchema = z.object({
  introduction: z.string().optional(),
  vocabulary: z.array(z.object({
    word: z.string(),
    translation: z.string(),
    pronunciation: z.string().optional(),
    example: z.string().optional()
  })).optional(),
  grammar: z.object({
    rule: z.string(),
    examples: z.array(z.string()),
    practice: z.array(z.string()).optional()
  }).optional(),
  phrases: z.array(z.object({
    phrase: z.string(),
    translation: z.string(),
    context: z.string().optional()
  })).optional(),
  exercises: z.array(z.object({
    type: z.enum(['fill-blank', 'translate', 'multiple-choice']),
    question: z.string(),
    options: z.array(z.string()).optional(),
    answer: z.string()
  })).optional()
});

export const createLessonSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  content: lessonContentSchema,
  audioUrl: z.string().url().optional(),
  language: languageSchema,
  difficulty: difficultySchema,
  lessonType: lessonTypeSchema,
  order: z.number().int().min(0).default(0),
  estimatedDuration: z.number().int().min(1).max(180).optional(), // 1-180 minutes
  tags: z.array(z.string()).default([])
});

export const updateLessonSchema = createLessonSchema.partial().extend({
  id: z.string().uuid()
});

export const lessonQuerySchema = z.object({
  language: languageSchema.optional(),
  difficulty: difficultySchema.optional(),
  lessonType: lessonTypeSchema.optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
  search: z.string().optional()
});

export const lessonProgressSchema = z.object({
  lessonId: z.string().uuid(),
  timeSpent: z.number().int().min(1).optional() // in minutes
});