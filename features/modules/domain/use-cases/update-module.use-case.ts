import { ModuleService } from '../service';
import type { UpdateModulePayload } from '../../config/module.types';

export async function updateModuleUseCase(id: string, data: Partial<UpdateModulePayload>) {
  try {
    const updatedModule = await ModuleService.updateModule(id, data);
    
    if (!updatedModule) {
      return {
        success: false,
        error: 'Module not found',
      };
    }

    return { success: true, data: updatedModule };
  } catch (error) {
    console.error('Error updating module:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update module' 
    };
  }
}