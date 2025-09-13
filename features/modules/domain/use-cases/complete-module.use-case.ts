import { ModuleService } from '../service';

export async function completeModuleUseCase(
  moduleId: string,
  userId: string
): Promise<{ success: boolean; data?: { unlockedModules: string[] }; error?: string }> {
  try {
    // Mark module as completed
    await ModuleService.completeModule(moduleId, userId);
    
    // The completeModule method automatically unlocks dependent modules
    // For now, we'll return success without specific unlocked modules info
    // In a future enhancement, we could return the list of newly unlocked modules
    
    return {
      success: true,
      data: {
        unlockedModules: [], // Could be enhanced to return actual unlocked modules
      },
    };
  } catch (error) {
    console.error('Complete module use case error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to complete module',
    };
  }
}