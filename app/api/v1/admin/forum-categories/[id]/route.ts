import { NextRequest, NextResponse } from 'next/server';
import { 
  updateForumCategoryUseCase, 
  deleteForumCategoryUseCase 
} from '@/features/admin/domain/use-cases/forum-categories.use-case';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await context.params;

    // Use the business logic layer to update forum category
    const result = await updateForumCategoryUseCase(id, body);
    
    if (!result.success) {
      console.error('Error updating forum category:', result.error);
      const status = result.error === 'Forum category not found' ? 404 : 500;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('PUT /api/v1/admin/forum-categories/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Use the business logic layer to delete forum category
    const result = await deleteForumCategoryUseCase(id);
    
    if (!result.success) {
      console.error('Error deleting forum category:', result.error);
      const status = result.error === 'Forum category not found' ? 404 : 500;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('DELETE /api/v1/admin/forum-categories/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}