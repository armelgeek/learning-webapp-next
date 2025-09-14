import { QuizService } from '../service';

export async function deleteQuizUseCase(id: string) {
  try {
    // Check if quiz exists
    const existingQuiz = await QuizService.getQuizById(id);
    
    if (!existingQuiz) {
      return {
        success: false,
        error: 'Quiz not found',
      };
    }

    // Delete the quiz
    const deletedQuiz = await QuizService.deleteQuiz(id);
    
    if (!deletedQuiz) {
      return {
        success: false,
        error: 'Failed to delete quiz',
      };
    }

    return {
      success: true,
      data: { message: 'Quiz deleted successfully', id },
    };
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return {
      success: false,
      error: 'Failed to delete quiz',
    };
  }
}