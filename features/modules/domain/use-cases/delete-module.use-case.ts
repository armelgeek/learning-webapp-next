import { ModuleService } from '../service';

export async function deleteModuleUseCase(id: string) {
  try {
    const deletedModule = await ModuleService.deleteModule(id);
    
    if (!deletedModule) {
      return {
        success: false,
        error: 'Module not found',
      };
    }

    return { success: true, data: { message: 'Module deleted successfully', id } };
  } catch (error) {
    console.error('Error deleting module:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete module' 
    };
  }
}