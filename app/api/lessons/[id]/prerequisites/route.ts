import { NextRequest, NextResponse } from 'next/server';
import { checkPrerequisitesUseCase } from '@/features/lessons/domain/use-cases/check-prerequisites.use-case';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const result = await checkPrerequisitesUseCase(lessonId, userId);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('GET /api/lessons/[id]/prerequisites error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}