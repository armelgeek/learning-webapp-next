import { QuizService } from '../service';

export async function getQuizByIdUseCase(id: string) {
  try {
    const quiz = await QuizService.getQuizById(id);
    
    if (!quiz) {
      return {
        success: false,
        error: 'Quiz not found',
      };
    }

    return {
      success: true,
      data: quiz,
    };
  } catch (error) {
    console.error('Error fetching quiz by ID:', error);
    return {
      success: false,
      error: 'Failed to fetch quiz',
    };
  }
}