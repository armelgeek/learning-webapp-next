import { LessonService } from '../service';

export async function checkPrerequisitesUseCase(lessonId: string, userId: string) {
  try {
    const result = await LessonService.checkPrerequisites(lessonId, userId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error checking prerequisites:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to check prerequisites' 
    };
  }
}

export async function getAvailableLessonsForPrerequisitesUseCase(excludeLessonId?: string) {
  try {
    const lessons = await LessonService.getAvailableLessonsForPrerequisites(excludeLessonId);
    return { success: true, data: lessons };
  } catch (error) {
    console.error('Error fetching available lessons for prerequisites:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch available lessons' 
    };
  }
}