import { QuizService } from '@/features/quizzes/domain/service';
import { QuizFilter } from '@/features/quizzes/config/quiz.types';

export async function getAdminQuizzesUseCase(filter?: QuizFilter) {
  try {
    const quizzes = await QuizService.getQuizzesForAdmin(filter);
    return { success: true, data: quizzes };
  } catch (error) {
    console.error('Error fetching admin quizzes:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch quizzes' 
    };
  }
}