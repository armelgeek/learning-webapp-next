import { NextRequest, NextResponse } from 'next/server';
import { getAdminModulesUseCase } from '@/features/admin/domain/use-cases/get-admin-modules.use-case';
import { ModuleFilter, Language, DifficultyLevel } from '@/features/modules/config/module.types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const difficultyLevel = searchParams.get('difficultyLevel');
    const isActive = searchParams.get('isActive');

    // Build filter object from query parameters
    const filter: ModuleFilter = {};
    
    if (language && language !== 'all') {
      filter.language = language as Language;
    }

    if (difficultyLevel && difficultyLevel !== 'all') {
      filter.difficultyLevel = difficultyLevel as DifficultyLevel;
    }

    if (isActive !== null && isActive !== undefined && isActive !== 'all') {
      filter.isActive = isActive === 'true';
    }

    // Use the business logic layer to get modules for admin
    const result = await getAdminModulesUseCase(filter);
    
    if (!result.success) {
      console.error('Error fetching admin modules:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('GET /api/v1/admin/modules error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}