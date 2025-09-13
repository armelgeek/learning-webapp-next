import { ProgressService } from '@/features/progress/domain/service';
import { ProgressFilter } from '@/features/progress/config/progress.types';

export async function getAdminUserProgressUseCase(filter?: ProgressFilter) {
  try {
    const progress = await ProgressService.getUserProgressForAdmin(filter);
    return { success: true, data: progress };
  } catch (error) {
    console.error('Error fetching admin user progress:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch user progress' 
    };
  }
}

export async function getAdminUserStatsUseCase() {
  try {
    const stats = await ProgressService.getUserStatsForAdmin();
    return { success: true, data: stats };
  } catch (error) {
    console.error('Error fetching admin user stats:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch user stats' 
    };
  }
}