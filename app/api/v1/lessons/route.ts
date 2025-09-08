import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { LessonService } from '@/features/lessons/domain/service';
import { lessonQuerySchema, createLessonSchema } from '@/features/lessons/config/lesson.schema';

// GET /api/v1/lessons - List lessons with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const queryParams = {
      language: searchParams.get('language') || undefined,
      difficulty: searchParams.get('difficulty') || undefined,
      lessonType: searchParams.get('lessonType') || undefined,
      tags: searchParams.getAll('tags'),
      page: parseInt(searchParams.get('page') || '1'),
      pageSize: parseInt(searchParams.get('pageSize') || '10'),
      search: searchParams.get('search') || undefined,
    };

    // Validate query parameters
    const validatedQuery = lessonQuerySchema.parse(queryParams);
    
    // Get lessons
    const result = await LessonService.getLessons(validatedQuery, userId);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}

// POST /api/v1/lessons - Create a new lesson (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // TODO: Add admin check here when role system is implemented
    // if (session.user.role !== 'admin') {
    //   return NextResponse.json(
    //     { error: 'Admin access required' },
    //     { status: 403 }
    //   );
    // }

    const body = await request.json();
    const validatedInput = createLessonSchema.parse(body);
    
    const lessonId = await LessonService.createLesson(validatedInput, session.user.id);
    
    return NextResponse.json(
      { id: lessonId, message: 'Lesson created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating lesson:', error);
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid lesson data', details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
}