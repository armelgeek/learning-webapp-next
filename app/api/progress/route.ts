import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserProgressUseCase } from '@/features/progress/domain/use-cases/get-progress.use-case';
import { updateLessonProgressUseCase } from '@/features/progress/domain/use-cases/update-progress.use-case';

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await auth.api.getSession({ 
      headers: request.headers 
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');

    // Get user progress using the business logic layer
    const result = await getUserProgressUseCase(session.user.id, lessonId || undefined);

    if (!result.success) {
      console.error('Error fetching user progress:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('GET /api/progress error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await auth.api.getSession({ 
      headers: request.headers 
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Create or update progress using the business logic layer
    const progressData = {
      userId: session.user.id,
      lessonId: body.lessonId,
      completed: body.completed || false,
      score: body.score || 0,
    };

    const result = await updateLessonProgressUseCase(progressData);
    
    if (!result.success) {
      console.error('Error updating progress:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    
    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('POST /api/progress error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}