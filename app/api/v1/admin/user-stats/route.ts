import { NextRequest, NextResponse } from 'next/server';
import { getAdminUserStatsUseCase } from '@/features/admin/domain/use-cases/get-admin-user-progress.use-case';

export async function GET(request: NextRequest) {
  try {
    // Use the business logic layer to get user stats for admin
    const result = await getAdminUserStatsUseCase();
    
    if (!result.success) {
      console.error('Error fetching admin user stats:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('GET /api/v1/admin/user-stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}