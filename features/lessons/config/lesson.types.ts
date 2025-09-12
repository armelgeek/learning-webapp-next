import { z } from 'zod';
import { createLessonSchema, updateLessonSchema, lessonFilterSchema, lessonContentSchema } from './lesson.schema';

export type LessonContent = z.infer<typeof lessonContentSchema>;
export type CreateLessonPayload = z.infer<typeof createLessonSchema>;
export type UpdateLessonPayload = z.infer<typeof updateLessonSchema>;
export type LessonFilter = z.infer<typeof lessonFilterSchema>;

export type LessonType = 'vocabulary' | 'grammar' | 'phrases' | 'pronunciation' | 'listening' | 'reading';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type Language = 'spanish' | 'french' | 'german' | 'italian' | 'portuguese' | 'japanese' | 'chinese' | 'english';

export interface Lesson {
  id: string;
  title: string;
  language: Language;
  type: LessonType;
  content: LessonContent;
  audioUrl?: string;
  difficultyLevel: DifficultyLevel;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}