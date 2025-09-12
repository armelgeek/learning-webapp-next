import { z } from 'zod';
import { createModuleSchema, updateModuleSchema, moduleFilterSchema } from './module.schema';

export type CreateModulePayload = z.infer<typeof createModuleSchema>;
export type UpdateModulePayload = z.infer<typeof updateModuleSchema>;
export type ModuleFilter = z.infer<typeof moduleFilterSchema>;

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type Language = 'spanish' | 'french' | 'german' | 'italian' | 'portuguese' | 'japanese' | 'chinese' | 'english';

export interface Module {
  id: string;
  title: string;
  description: string | null;
  language: Language;
  difficultyLevel: DifficultyLevel;
  imageUrl: string | null;
  isActive: boolean;
  order: number;
  estimatedDuration: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ModuleWithProgress extends Module {
  totalLessons: number;
  completedLessons: number;
  isUnlocked: boolean;
  completionPercentage: number;
  lessons: Array<{
    id: string;
    title: string;
    type: string;
    completed: boolean;
    order: number;
  }>;
}

export interface ModuleProgress {
  moduleId: string;
  totalLessons: number;
  completedLessons: number;
  completionPercentage: number;
  isCompleted: boolean;
}