import { ProgressService } from '../service';
import { CreateProgressPayload, UpdateProgressPayload } from '../../config/progress.types';

export async function getUserProgressUseCase(userId: string, lessonId?: string) {
  try {
    const progress = await ProgressService.getUserProgress(userId, lessonId);
    return { success: true, data: progress };
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch user progress' 
    };
  }
}

export async function getProgressSummaryUseCase(userId: string) {
  try {
    const summary = await ProgressService.getProgressSummary(userId);
    return { success: true, data: summary };
  } catch (error) {
    console.error('Error fetching progress summary:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch progress summary' 
    };
  }
}

export async function getUserStatsUseCase(userId: string) {
  try {
    const stats = await ProgressService.getUserStats(userId);
    return { success: true, data: stats };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch user stats' 
    };
  }
}