import { z } from 'zod';
import { 
  createLessonSchema, 
  updateLessonSchema, 
  lessonQuerySchema, 
  lessonProgressSchema,
  languageSchema,
  difficultySchema,
  lessonTypeSchema,
  lessonContentSchema
} from './lesson.schema';

export type Language = z.infer<typeof languageSchema>;
export type Difficulty = z.infer<typeof difficultySchema>;
export type LessonType = z.infer<typeof lessonTypeSchema>;
export type LessonContent = z.infer<typeof lessonContentSchema>;

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
export type LessonQuery = z.infer<typeof lessonQuerySchema>;
export type LessonProgressInput = z.infer<typeof lessonProgressSchema>;

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  content: LessonContent;
  audioUrl?: string;
  language: Language;
  difficulty: Difficulty;
  lessonType: LessonType;
  order: number;
  isActive: boolean;
  estimatedDuration?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  isCompleted: boolean;
  completedAt?: Date;
  timeSpent?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonWithProgress extends Lesson {
  progress?: LessonProgress;
}

export interface LessonQueryResult {
  lessons: LessonWithProgress[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}