import { ModuleService } from '@/features/modules/domain/service';
import { ModuleFilter } from '@/features/modules/config/module.types';

export async function getAdminModulesUseCase(filter?: ModuleFilter) {
  try {
    const modules = await ModuleService.getModulesForAdmin(filter);
    return { success: true, data: modules };
  } catch (error) {
    console.error('Error fetching admin modules:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch modules' 
    };
  }
}