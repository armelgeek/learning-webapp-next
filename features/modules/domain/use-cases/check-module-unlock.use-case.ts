import { ModuleService } from '../service';
import type { ModuleStatus } from '../../config/module.types';

export async function checkModuleUnlockUseCase(
  moduleId: string,
  userId: string
): Promise<{ success: boolean; data?: { status: ModuleStatus; prerequisitesMet: boolean }; error?: string }> {
  try {
    const moduleProgress = await ModuleService.getModuleProgress(moduleId, userId);
    
    return {
      success: true,
      data: {
        status: moduleProgress.status,
        prerequisitesMet: moduleProgress.prerequisitesMet,
      },
    };
  } catch (error) {
    console.error('Check module unlock use case error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check module unlock status',
    };
  }
}