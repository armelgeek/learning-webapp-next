import { QuizService } from '../service';
import { QuizFilter } from '../../config/quiz.types';

export async function getQuizzesUseCase(filter?: QuizFilter) {
  try {
    const quizzes = await QuizService.getQuizzes(filter);
    return { success: true, data: quizzes };
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch quizzes' 
    };
  }
}

export async function getQuizzesByLessonUseCase(lessonId: string) {
  try {
    const quizzes = await QuizService.getQuizzesByLesson(lessonId);
    return { success: true, data: quizzes };
  } catch (error) {
    console.error('Error fetching quizzes for lesson:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch quizzes for lesson' 
    };
  }
}

export async function getQuizByIdUseCase(id: string) {
  try {
    const quiz = await QuizService.getQuizById(id);
    if (!quiz) {
      return { success: false, error: 'Quiz not found' };
    }
    return { success: true, data: quiz };
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch quiz' 
    };
  }
}