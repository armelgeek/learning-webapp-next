import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { LessonService } from '@/features/lessons/domain/service';
import { updateLessonSchema } from '@/features/lessons/config/lesson.schema';

interface Params {
  id: string;
}

// GET /api/v1/lessons/[id] - Get a single lesson
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    const lesson = await LessonService.getLessonById(id, userId);
    
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}

// PUT /api/v1/lessons/[id] - Update a lesson (admin only)
export async function PUT(
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

    // TODO: Add admin check here when role system is implemented

    const body = await request.json();
    const validatedInput = updateLessonSchema.parse({ ...body, id });
    
    const success = await LessonService.updateLesson(validatedInput);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Lesson updated successfully' });
  } catch (error) {
    console.error('Error updating lesson:', error);
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid lesson data', details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update lesson' },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/lessons/[id] - Delete a lesson (admin only)
export async function DELETE(
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

    // TODO: Add admin check here when role system is implemented

    const success = await LessonService.deleteLesson(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { error: 'Failed to delete lesson' },
      { status: 500 }
    );
  }
}