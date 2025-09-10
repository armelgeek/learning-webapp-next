import { QuizService } from '../service';
import { CreateQuizPayload } from '../../config/quiz.types';

export async function createQuizUseCase(data: CreateQuizPayload) {
  try {
    // Validate that the selected answer is in the options
    if (!data.options.includes(data.correctAnswer)) {
      return { 
        success: false, 
        error: 'Correct answer must be one of the provided options' 
      };
    }

    const quiz = await QuizService.createQuiz(data);
    return { success: true, data: quiz };
  } catch (error) {
    console.error('Error creating quiz:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create quiz' 
    };
  }
}

export async function submitQuizAnswerUseCase(
  quizId: string, 
  selectedAnswer: string, 
  timeSpent?: number
) {
  try {
    const quiz = await QuizService.getQuizById(quizId);
    if (!quiz) {
      return { success: false, error: 'Quiz not found' };
    }

    const result = QuizService.checkAnswer(quiz, selectedAnswer);
    return { 
      success: true, 
      data: {
        ...result,
        explanation: quiz.explanation,
        timeSpent,
      }
    };
  } catch (error) {
    console.error('Error submitting quiz answer:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit quiz answer' 
    };
  }
}