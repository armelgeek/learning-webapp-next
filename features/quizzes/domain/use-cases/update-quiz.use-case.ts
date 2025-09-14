import { QuizService } from '../service';
import type { UpdateQuizInput } from '../../config/quiz.schema';

export async function updateQuizUseCase(data: UpdateQuizInput) {
  try {
    // Check if quiz exists
    const existingQuiz = await QuizService.getQuizById(data.id);
    
    if (!existingQuiz) {
      return {
        success: false,
        error: 'Quiz not found',
      };
    }

    // Update the quiz
    const updatedQuiz = await QuizService.updateQuiz(data.id, data);
    
    if (!updatedQuiz) {
      return {
        success: false,
        error: 'Failed to update quiz',
      };
    }

    return {
      success: true,
      data: updatedQuiz,
    };
  } catch (error) {
    console.error('Error updating quiz:', error);
    return {
      success: false,
      error: 'Failed to update quiz',
    };
  }
}