import { ForumCategoriesService, ForumCategoryFilter } from '../forum-categories.service';

export async function getForumCategoriesUseCase(filter?: ForumCategoryFilter) {
  try {
    const categories = await ForumCategoriesService.getForumCategories(filter);
    return { success: true, data: categories };
  } catch (error) {
    console.error('Error fetching forum categories:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch forum categories' 
    };
  }
}

export async function createForumCategoryUseCase(data: any) {
  try {
    const category = await ForumCategoriesService.createForumCategory(data);
    return { success: true, data: category };
  } catch (error) {
    console.error('Error creating forum category:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create forum category' 
    };
  }
}

export async function updateForumCategoryUseCase(id: string, data: any) {
  try {
    const category = await ForumCategoriesService.updateForumCategory(id, data);
    if (!category) {
      return { success: false, error: 'Forum category not found' };
    }
    return { success: true, data: category };
  } catch (error) {
    console.error('Error updating forum category:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update forum category' 
    };
  }
}

export async function deleteForumCategoryUseCase(id: string) {
  try {
    const category = await ForumCategoriesService.deleteForumCategory(id);
    if (!category) {
      return { success: false, error: 'Forum category not found' };
    }
    return { success: true, data: category };
  } catch (error) {
    console.error('Error deleting forum category:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete forum category' 
    };
  }
}