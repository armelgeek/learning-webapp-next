import { z } from 'zod';

export const moduleFilterSchema = z.object({
  language: z.string().optional(),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  isActive: z.boolean().optional(),
});

export const createModuleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  language: z.enum(['spanish', 'french', 'german', 'italian', 'portuguese', 'japanese', 'chinese', 'english']),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  imageUrl: z.string().url().optional(),
  estimatedDuration: z.number().positive().optional(),
  order: z.number().default(0),
});

export const updateModuleSchema = createModuleSchema.partial();