import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getQuizzesUseCase } from '@/features/quizzes/domain/use-cases/get-quizzes.use-case';
import { createQuizUseCase } from '@/features/quizzes/domain/use-cases/create-quiz.use-case';
import { createQuizSchema, quizFilterSchema } from '@/features/quizzes/config/quiz.schema';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');
    const type = searchParams.get('type');

    // Validate filter parameters
    const filterResult = quizFilterSchema.safeParse({
      lessonId: lessonId || undefined,
      type: type || undefined,
    });

    if (!filterResult.success) {
      return NextResponse.json(
        { error: 'Invalid filter parameters', details: filterResult.error.format() },
        { status: 400 }
      );
    }

    const result = await getQuizzesUseCase(filterResult.data);
    
    if (!result.success) {
      console.error('Error fetching quizzes:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('GET /api/v1/quizzes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate request body
    const validationResult = createQuizSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid quiz data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const result = await createQuizUseCase(validationResult.data);
    
    if (!result.success) {
      console.error('Error creating quiz:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('POST /api/v1/quizzes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}