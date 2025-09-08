import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { LessonService } from '@/features/lessons/domain/service';
import { lessonProgressSchema } from '@/features/lessons/config/lesson.schema';

interface Params {
  id: string;
}

// POST /api/v1/lessons/[id]/complete - Mark a lesson as completed
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedInput = lessonProgressSchema.parse({ 
      lessonId: id, 
      timeSpent: body.timeSpent 
    });
    
    const success = await LessonService.markLessonCompleted(
      validatedInput, 
      session.user.id
    );
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to mark lesson as completed' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Lesson marked as completed successfully' 
    });
  } catch (error) {
    console.error('Error marking lesson as completed:', error);
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid progress data', details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to mark lesson as completed' },
      { status: 500 }
    );
  }
}