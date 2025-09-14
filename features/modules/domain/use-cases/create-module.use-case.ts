import { ModuleService } from '../service';
import type { CreateModulePayload } from '../../config/module.types';

export async function createModuleUseCase(data: CreateModulePayload) {
  try {
    const moduleData = await ModuleService.createModule(data);
    return { success: true, data: moduleData };
  } catch (error) {
    console.error('Error creating module:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create module' 
    };
  }
}