import { NextRequest, NextResponse } from 'next/server';
import { getLessonsUseCase } from '@/features/lessons/domain/use-cases/get-lessons.use-case';
import { createLessonUseCase } from '@/features/lessons/domain/use-cases/create-lesson.use-case';
import { LessonFilter, Language, LessonType, DifficultyLevel } from '@/features/lessons/config/lesson.types';
import { createLessonSchema } from '@/features/lessons/config/lesson.schema';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const type = searchParams.get('type');
    const difficultyLevel = searchParams.get('difficultyLevel');

    // Build filter object from query parameters
    const filter: LessonFilter = {};
    
    if (language && language !== 'all') {
      filter.language = language as Language;
    }

    if (type && type !== 'all') {
      filter.type = type as LessonType;
    }

    if (difficultyLevel && difficultyLevel !== 'all') {
      filter.difficultyLevel = difficultyLevel as DifficultyLevel;
    }

    // Default to only active lessons
    filter.isActive = true;

    // Use the business logic layer to get lessons
    const result = await getLessonsUseCase(filter);
    
    if (!result.success) {
      console.error('Error fetching lessons:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('GET /api/lessons error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validationResult = createLessonSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Invalid lesson data', 
        details: validationResult.error.errors 
      }, { status: 400 });
    }

    // Use the business logic layer to create the lesson
    const result = await createLessonUseCase(validationResult.data);
    
    if (!result.success) {
      console.error('Error creating lesson:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('POST /api/lessons error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}