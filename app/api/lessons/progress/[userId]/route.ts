import { NextRequest, NextResponse } from 'next/server';
import { getLessonsWithProgressUseCase } from '@/features/lessons/domain/use-cases/get-lessons.use-case';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
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

    const result = await getLessonsWithProgressUseCase(
      params.userId, 
      Object.keys(filter).length > 0 ? filter : undefined
    );
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('GET /api/lessons/progress/[userId] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}