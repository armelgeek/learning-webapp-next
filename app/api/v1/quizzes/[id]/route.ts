import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { updateQuizSchema } from '@/features/quizzes/config/quiz.schema';

// We need to create update and delete use cases
import { updateQuizUseCase } from '@/features/quizzes/domain/use-cases/update-quiz.use-case';
import { deleteQuizUseCase } from '@/features/quizzes/domain/use-cases/delete-quiz.use-case';
import { getQuizByIdUseCase } from '@/features/quizzes/domain/use-cases/get-quiz-by-id.use-case';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    const result = await getQuizByIdUseCase(id);
    
    if (!result.success) {
      console.error('Error fetching quiz:', result.error);
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('GET /api/v1/quizzes/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    
    // Validate request body
    const validationResult = updateQuizSchema.safeParse({ ...body, id });
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid quiz data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const result = await updateQuizUseCase(validationResult.data);
    
    if (!result.success) {
      console.error('Error updating quiz:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('PUT /api/v1/quizzes/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const result = await deleteQuizUseCase(id);
    
    if (!result.success) {
      console.error('Error deleting quiz:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/v1/quizzes/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}