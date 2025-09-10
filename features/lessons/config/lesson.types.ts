import { z } from 'zod';
import { createLessonSchema, updateLessonSchema, lessonFilterSchema, lessonContentSchema } from './lesson.schema';

export type LessonContent = z.infer<typeof lessonContentSchema>;
export type CreateLessonPayload = z.infer<typeof createLessonSchema>;
export type UpdateLessonPayload = z.infer<typeof updateLessonSchema>;
export type LessonFilter = z.infer<typeof lessonFilterSchema>;

export type LessonType = 'vocabulary' | 'grammar' | 'phrases';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type Language = 'spanish' | 'french' | 'german' | 'italian' | 'portuguese' | 'japanese' | 'chinese';