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