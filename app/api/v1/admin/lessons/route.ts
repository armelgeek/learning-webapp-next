import { NextRequest, NextResponse } from 'next/server';
import { getAdminLessonsUseCase } from '@/features/admin/domain/use-cases/get-admin-lessons.use-case';
import { LessonFilter, Language, LessonType, DifficultyLevel } from '@/features/lessons/config/lesson.types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const type = searchParams.get('type');
    const difficultyLevel = searchParams.get('difficultyLevel');
    const isActive = searchParams.get('isActive');

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

    if (isActive !== null && isActive !== undefined && isActive !== 'all') {
      filter.isActive = isActive === 'true';
    }

    // Use the business logic layer to get lessons for admin
    const result = await getAdminLessonsUseCase(filter);
    
    if (!result.success) {
      console.error('Error fetching admin lessons:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('GET /api/v1/admin/lessons error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}