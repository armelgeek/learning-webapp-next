import { NextRequest, NextResponse } from 'next/server';
import { getAvailableLessonsForPrerequisitesUseCase } from '@/features/lessons/domain/use-cases/check-prerequisites.use-case';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeLessonId = searchParams.get('exclude');

    const result = await getAvailableLessonsForPrerequisitesUseCase(excludeLessonId || undefined);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('GET /api/lessons/available-for-prerequisites error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}