import { ModuleService } from '../service';
import type { Language } from '../../config/module.types';

export async function checkModuleUnlockUseCase(
  moduleId: string,
  userId: string,
  language: Language
): Promise<{ success: boolean; data?: boolean; error?: string }> {
  try {
    const isUnlocked = await ModuleService.isModuleUnlocked(moduleId, userId, language);
    
    return {
      success: true,
      data: isUnlocked,
    };
  } catch (error) {
    console.error('Check module unlock use case error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check module unlock status',
    };
  }
}