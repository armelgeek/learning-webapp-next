import { LessonService } from '../service';
import { CreateLessonPayload } from '../../config/lesson.types';

export async function createLessonUseCase(data: CreateLessonPayload) {
  try {
    const lesson = await LessonService.createLesson(data);
    return { success: true, data: lesson };
  } catch (error) {
    console.error('Error creating lesson:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create lesson' 
    };
  }
}

export async function updateLessonUseCase(id: string, data: Partial<CreateLessonPayload>) {
  try {
    const lesson = await LessonService.updateLesson(id, data);
    if (!lesson) {
      return { success: false, error: 'Lesson not found' };
    }
    return { success: true, data: lesson };
  } catch (error) {
    console.error('Error updating lesson:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update lesson' 
    };
  }
}

export async function deleteLessonUseCase(id: string) {
  try {
    const lesson = await LessonService.deleteLesson(id);
    if (!lesson) {
      return { success: false, error: 'Lesson not found' };
    }
    return { success: true, data: lesson };
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete lesson' 
    };
  }
}