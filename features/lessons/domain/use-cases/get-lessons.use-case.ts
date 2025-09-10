import { LessonService } from '../service';
import { LessonFilter } from '../../config/lesson.types';

export async function getLessonsUseCase(filter?: LessonFilter) {
  try {
    const lessons = await LessonService.getLessons(filter);
    return { success: true, data: lessons };
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch lessons' 
    };
  }
}

export async function getLessonByIdUseCase(id: string) {
  try {
    const lesson = await LessonService.getLessonById(id);
    if (!lesson) {
      return { success: false, error: 'Lesson not found' };
    }
    return { success: true, data: lesson };
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch lesson' 
    };
  }
}

export async function getLessonsWithProgressUseCase(userId: string, filter?: LessonFilter) {
  try {
    const lessons = await LessonService.getLessonsWithUserProgress(userId, filter);
    return { success: true, data: lessons };
  } catch (error) {
    console.error('Error fetching lessons with progress:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch lessons with progress' 
    };
  }
}