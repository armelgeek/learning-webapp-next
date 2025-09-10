import { NextRequest, NextResponse } from 'next/server';
import { getLessonByIdUseCase } from '@/features/lessons/domain/use-cases/get-lessons.use-case';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await getLessonByIdUseCase(id);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('GET /api/lessons/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}