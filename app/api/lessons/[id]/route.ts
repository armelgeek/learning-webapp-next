import { NextRequest, NextResponse } from 'next/server';
import { getLessonByIdUseCase } from '@/features/lessons/domain/use-cases/get-lessons.use-case';
import { updateLessonUseCase, deleteLessonUseCase } from '@/features/lessons/domain/use-cases/create-lesson.use-case';
import { updateLessonSchema } from '@/features/lessons/config/lesson.schema';

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate the request body
    const validationResult = updateLessonSchema.safeParse({ id, ...body });
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Invalid lesson data', 
        details: validationResult.error.errors 
      }, { status: 400 });
    }

    // Use the business logic layer to update the lesson
    const result = await updateLessonUseCase(id, validationResult.data);
    
    if (!result.success) {
      console.error('Error updating lesson:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('PUT /api/lessons/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Use the business logic layer to delete the lesson
    const result = await deleteLessonUseCase(id);
    
    if (!result.success) {
      console.error('Error deleting lesson:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('DELETE /api/lessons/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}