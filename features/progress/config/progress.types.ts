import { z } from 'zod';
import { 
  createProgressSchema, 
  updateProgressSchema, 
  progressFilterSchema,
  updateUserStatsSchema 
} from './progress.schema';

export type CreateProgressPayload = z.infer<typeof createProgressSchema>;
export type UpdateProgressPayload = z.infer<typeof updateProgressSchema>;
export type ProgressFilter = z.infer<typeof progressFilterSchema>;
export type UpdateUserStatsPayload = z.infer<typeof updateUserStatsSchema>;

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  score?: number;
  attempts: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  id: string;
  userId: string;
  streakDays: number;
  totalLessonsCompleted: number;
  totalWordsLearned: number;
  currentLevel: DifficultyLevel;
  lastPracticeDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgressSummary {
  totalLessons: number;
  completedLessons: number;
  averageScore: number;
  streak: number;
  level: DifficultyLevel;
  recentActivity: UserProgress[];
}