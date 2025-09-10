import { NextRequest, NextResponse } from 'next/server';
import { getLessonsWithProgressUseCase } from '@/features/lessons/domain/use-cases/get-lessons.use-case';
import { lessonFilterSchema } from '@/features/lessons/config/lesson.schema';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    const rawFilter = {
      language: searchParams.get('language'),
      type: searchParams.get('type'),
      difficultyLevel: searchParams.get('difficultyLevel'),
    };

    // Remove null values and validate with schema
    const cleanFilter = Object.fromEntries(
      Object.entries(rawFilter).filter(([, value]) => value !== null)
    );

    // Validate the filter using the schema
    const filterResult = lessonFilterSchema.safeParse(cleanFilter);
    const validFilter = filterResult.success ? filterResult.data : undefined;

    const result = await getLessonsWithProgressUseCase(userId, validFilter);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('GET /api/lessons/progress/[userId] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}