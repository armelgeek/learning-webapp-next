import { NextRequest, NextResponse } from 'next/server';
import { getAdminQuizzesUseCase } from '@/features/admin/domain/use-cases/get-admin-quizzes.use-case';
import { QuizFilter, QuizType } from '@/features/quizzes/config/quiz.types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');
    const type = searchParams.get('type');

    // Build filter object from query parameters
    const filter: QuizFilter = {};
    
    if (lessonId && lessonId !== 'all') {
      filter.lessonId = lessonId;
    }

    if (type && type !== 'all') {
      filter.type = type as QuizType;
    }

    // Use the business logic layer to get quizzes for admin
    const result = await getAdminQuizzesUseCase(filter);
    
    if (!result.success) {
      console.error('Error fetching admin quizzes:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('GET /api/v1/admin/quizzes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}