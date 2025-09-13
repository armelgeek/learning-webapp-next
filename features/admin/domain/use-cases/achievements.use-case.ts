import { AchievementsService, AchievementFilter } from '../achievements.service';

export async function getAchievementsUseCase(filter?: AchievementFilter) {
  try {
    const achievements = await AchievementsService.getAchievements(filter);
    return { success: true, data: achievements };
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch achievements' 
    };
  }
}

export async function createAchievementUseCase(data: any) {
  try {
    const achievement = await AchievementsService.createAchievement(data);
    return { success: true, data: achievement };
  } catch (error) {
    console.error('Error creating achievement:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create achievement' 
    };
  }
}

export async function updateAchievementUseCase(id: string, data: any) {
  try {
    const achievement = await AchievementsService.updateAchievement(id, data);
    if (!achievement) {
      return { success: false, error: 'Achievement not found' };
    }
    return { success: true, data: achievement };
  } catch (error) {
    console.error('Error updating achievement:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update achievement' 
    };
  }
}

export async function deleteAchievementUseCase(id: string) {
  try {
    const achievement = await AchievementsService.deleteAchievement(id);
    if (!achievement) {
      return { success: false, error: 'Achievement not found' };
    }
    return { success: true, data: achievement };
  } catch (error) {
    console.error('Error deleting achievement:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete achievement' 
    };
  }
}