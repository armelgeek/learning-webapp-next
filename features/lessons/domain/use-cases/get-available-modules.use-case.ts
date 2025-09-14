import { LessonService } from '../service';

export async function getAvailableModulesUseCase() {
  try {
    const modules = await LessonService.getAvailableModules();
    return { success: true, data: modules };
  } catch (error) {
    console.error('Error getting available modules:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get available modules' 
    };
  }
}