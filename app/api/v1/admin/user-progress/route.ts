import { NextRequest, NextResponse } from 'next/server';
import { getAdminUserProgressUseCase } from '@/features/admin/domain/use-cases/get-admin-user-progress.use-case';
import { ProgressFilter } from '@/features/progress/config/progress.types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const lessonId = searchParams.get('lessonId');
    const completed = searchParams.get('completed');

    // Build filter object from query parameters
    const filter: ProgressFilter = {};
    
    if (userId && userId !== 'all') {
      filter.userId = userId;
    }

    if (lessonId && lessonId !== 'all') {
      filter.lessonId = lessonId;
    }

    if (completed !== null && completed !== undefined && completed !== 'all') {
      filter.completed = completed === 'true';
    }

    // Use the business logic layer to get user progress for admin
    const result = await getAdminUserProgressUseCase(filter);
    
    if (!result.success) {
      console.error('Error fetching admin user progress:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('GET /api/v1/admin/user-progress error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}