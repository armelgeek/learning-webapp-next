import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/drizzle/db';
import { moduleLessons } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const reorderLessonsSchema = z.object({
  lessonOrders: z.array(z.object({
    lessonId: z.string().uuid(),
    order: z.number().min(0),
  })),
});

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: moduleId } = await context.params;
    const body = await request.json();
    
    // Validate request body
    const validationResult = reorderLessonsSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { lessonOrders } = validationResult.data;

    // Update the order for each lesson in the module
    for (const { lessonId, order } of lessonOrders) {
      await db
        .update(moduleLessons)
        .set({ order })
        .where(
          and(
            eq(moduleLessons.moduleId, moduleId),
            eq(moduleLessons.lessonId, lessonId)
          )
        );
    }

    return NextResponse.json({ 
      message: 'Lesson order updated successfully',
      updated: lessonOrders.length 
    });
  } catch (error) {
    console.error('PUT /api/modules/[id]/lessons/order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}