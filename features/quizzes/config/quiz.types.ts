import { z } from 'zod';
import { createQuizSchema, updateQuizSchema, quizFilterSchema, quizAnswerSchema } from './quiz.schema';

export type CreateQuizPayload = z.infer<typeof createQuizSchema>;
export type UpdateQuizPayload = z.infer<typeof updateQuizSchema>;
export type QuizFilter = z.infer<typeof quizFilterSchema>;
export type QuizAnswer = z.infer<typeof quizAnswerSchema>;

export type QuizType = 'multiple_choice' | 'flashcard' | 'fill_blanks' | 'translation' | 'dictation' | 'pronunciation';

export interface Quiz {
  id: string;
  lessonId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  type: QuizType;
  explanation?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizResult {
  isCorrect: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  explanation?: string;
  timeSpent?: number;
}