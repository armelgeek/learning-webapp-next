import { NextRequest, NextResponse } from 'next/server';
import { 
  getAchievementsUseCase, 
  createAchievementUseCase 
} from '@/features/admin/domain/use-cases/achievements.use-case';
import { AchievementFilter } from '@/features/admin/domain/achievements.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const isActive = searchParams.get('isActive');

    // Build filter object from query parameters
    const filter: AchievementFilter = {};
    
    if (type && type !== 'all') {
      filter.type = type;
    }

    if (isActive !== null && isActive !== undefined && isActive !== 'all') {
      filter.isActive = isActive === 'true';
    }

    // Use the business logic layer to get achievements
    const result = await getAchievementsUseCase(filter);
    
    if (!result.success) {
      console.error('Error fetching achievements:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('GET /api/v1/admin/achievements error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Use the business logic layer to create achievement
    const result = await createAchievementUseCase(body);
    
    if (!result.success) {
      console.error('Error creating achievement:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('POST /api/v1/admin/achievements error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}