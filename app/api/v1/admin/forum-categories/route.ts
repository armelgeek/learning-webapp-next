import { NextRequest, NextResponse } from 'next/server';
import { 
  getForumCategoriesUseCase, 
  createForumCategoryUseCase
} from '@/features/admin/domain/use-cases/forum-categories.use-case';
import { ForumCategoryFilter } from '@/features/admin/domain/forum-categories.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const isActive = searchParams.get('isActive');

    // Build filter object from query parameters
    const filter: ForumCategoryFilter = {};
    
    if (language && language !== 'all') {
      filter.language = language;
    }

    if (isActive !== null && isActive !== undefined && isActive !== 'all') {
      filter.isActive = isActive === 'true';
    }

    // Use the business logic layer to get forum categories
    const result = await getForumCategoriesUseCase(filter);
    
    if (!result.success) {
      console.error('Error fetching forum categories:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('GET /api/v1/admin/forum-categories error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Use the business logic layer to create forum category
    const result = await createForumCategoryUseCase(body);
    
    if (!result.success) {
      console.error('Error creating forum category:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('POST /api/v1/admin/forum-categories error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}