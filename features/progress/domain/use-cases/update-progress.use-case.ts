import { ProgressService } from '../service';
import { CreateProgressPayload, UpdateProgressPayload } from '../../config/progress.types';

export async function updateLessonProgressUseCase(data: CreateProgressPayload | UpdateProgressPayload) {
  try {
    const progress = await ProgressService.createOrUpdateProgress(data);
    
    // Update user stats if lesson is completed
    if (data.completed) {
      const currentStats = await ProgressService.getUserStats(data.userId);
      const today = new Date();
      
      await ProgressService.createOrUpdateUserStats({
        userId: data.userId,
        totalLessonsCompleted: (currentStats?.totalLessonsCompleted || 0) + 1,
        lastPracticeDate: today,
        streakDays: ProgressService.calculateStreak(
          currentStats?.lastPracticeDate ? new Date(currentStats.lastPracticeDate) : undefined
        ) + 1,
      });
    }

    return { success: true, data: progress };
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update lesson progress' 
    };
  }
}

export async function recordPracticeSessionUseCase(userId: string, wordsLearned?: number) {
  try {
    const currentStats = await ProgressService.getUserStats(userId);
    const today = new Date();
    
    await ProgressService.createOrUpdateUserStats({
      userId,
      totalWordsLearned: (currentStats?.totalWordsLearned || 0) + (wordsLearned || 0),
      lastPracticeDate: today,
      streakDays: ProgressService.calculateStreak(
        currentStats?.lastPracticeDate ? new Date(currentStats.lastPracticeDate) : undefined
      ) + 1,
    });

    return { success: true, data: { message: 'Practice session recorded' } };
  } catch (error) {
    console.error('Error recording practice session:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to record practice session' 
    };
  }
}