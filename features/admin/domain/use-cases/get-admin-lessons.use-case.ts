import { LessonService } from '@/features/lessons/domain/service';
import { LessonFilter } from '@/features/lessons/config/lesson.types';

export async function getAdminLessonsUseCase(filter?: LessonFilter) {
  try {
    const lessons = await LessonService.getLessonsForAdmin(filter);
    return { success: true, data: lessons };
  } catch (error) {
    console.error('Error fetching admin lessons:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch lessons' 
    };
  }
}