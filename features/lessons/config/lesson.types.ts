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
  description?: string;
  language: Language;
  type: LessonType;
  content: LessonContent;
  audioUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  difficultyLevel: DifficultyLevel;
  estimatedDuration: number;
  pointsReward: number;
  isActive: boolean;
  order: number;
  prerequisites?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonWithProgress extends Lesson {
  progress?: {
    id: string;
    completed: boolean;
    score?: number;
    attempts: number;
    completedAt?: Date;
  };
  isUnlocked: boolean;
  unmetPrerequisites: string[];
}

export interface PrerequisiteCheck {
  lessonId: string;
  isUnlocked: boolean;
  unmetPrerequisites: string[];
  prerequisiteDetails: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}