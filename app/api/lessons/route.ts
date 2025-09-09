import { NextRequest, NextResponse } from 'next/server';
import { getLessonsUseCase } from '@/features/lessons/domain/use-cases/get-lessons.use-case';
import { createLessonUseCase } from '@/features/lessons/domain/use-cases/create-lesson.use-case';
import { createLessonSchema } from '@/features/lessons/config/lesson.schema';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = {
      language: searchParams.get('language') as any,
      type: searchParams.get('type') as any,
      difficultyLevel: searchParams.get('difficultyLevel') as any,
    };

    // Remove null values
    Object.keys(filter).forEach(key => {
      if (filter[key as keyof typeof filter] === null) {
        delete filter[key as keyof typeof filter];
      }
    });

    const result = await getLessonsUseCase(Object.keys(filter).length > 0 ? filter : undefined);
    
    if (!result.success) {
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
    
    // Validate request body
    const validatedData = createLessonSchema.parse(body);
    
    const result = await createLessonUseCase(validatedData);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('POST /api/lessons error:', error);
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}