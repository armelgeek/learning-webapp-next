import { z } from 'zod';

export const quizOptionsSchema = z.array(z.string()).min(2, 'At least 2 options required');

export const createQuizSchema = z.object({
  lessonId: z.string().min(1, 'Lesson ID is required'),
  question: z.string().min(1, 'Question is required'),
  options: quizOptionsSchema,
  correctAnswer: z.string().min(1, 'Correct answer is required'),
  type: z.enum(['multiple_choice', 'flashcard']).default('multiple_choice'),
  explanation: z.string().optional(),
});

export const updateQuizSchema = createQuizSchema.partial().extend({
  id: z.string(),
});

export const quizAnswerSchema = z.object({
  quizId: z.string(),
  selectedAnswer: z.string(),
  timeSpent: z.number().min(0).optional(),
});

export const quizFilterSchema = z.object({
  lessonId: z.string().optional(),
  type: z.enum(['multiple_choice', 'flashcard']).optional(),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type UpdateQuizInput = z.infer<typeof updateQuizSchema>;
export type QuizAnswerInput = z.infer<typeof quizAnswerSchema>;
export type QuizFilterInput = z.infer<typeof quizFilterSchema>;