import { ModuleService } from '../service';
import type { Language, ModuleWithProgress } from '../../config/module.types';

export async function getModulesWithProgressUseCase(
  language: Language,
  userId?: string
): Promise<{ success: boolean; data?: ModuleWithProgress[]; error?: string }> {
  try {
    const modules = await ModuleService.getModulesWithProgress(language, userId);
    
    return {
      success: true,
      data: modules,
    };
  } catch (error) {
    console.error('Get modules with progress use case error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch modules',
    };
  }
}