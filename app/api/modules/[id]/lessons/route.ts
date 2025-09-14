import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/drizzle/db';
import { moduleLessons, lessons, modules } from '@/drizzle/schema';
import { eq, and, sql } from 'drizzle-orm';
import { z } from 'zod';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const assignLessonsSchema = z.object({
  lessonIds: z.array(z.string().uuid()),
  orders: z.array(z.number()).optional(),
});

const removeLessonSchema = z.object({
  lessonId: z.string().uuid(),
});

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id: moduleId } = await context.params;

    // Get lessons assigned to this module
    const assignedLessons = await db
      .select({
        lesson: lessons,
        order: moduleLessons.order,
      })
      .from(moduleLessons)
      .innerJoin(lessons, eq(lessons.id, moduleLessons.lessonId))
      .where(eq(moduleLessons.moduleId, moduleId))
      .orderBy(moduleLessons.order, lessons.order);

    // Get assigned lesson IDs for exclusion
    const assignedLessonIds = assignedLessons.map(al => al.lesson.id);

    // Get all available lessons not in this module
    let availableLessonsQuery = db
      .select({
        id: lessons.id,
        title: lessons.title,
        type: lessons.type,
        difficultyLevel: lessons.difficultyLevel,
        language: lessons.language,
        estimatedDuration: lessons.estimatedDuration,
      })
      .from(lessons)
      .where(eq(lessons.isActive, true));

    // If there are assigned lessons, exclude them
    if (assignedLessonIds.length > 0) {
      availableLessonsQuery = availableLessonsQuery.where(
        sql`${lessons.id} NOT IN (${sql.join(assignedLessonIds.map(id => sql`${id}`), sql`, `)})`
      );
    }

    const availableLessons = await availableLessonsQuery.orderBy(lessons.order, lessons.title);

    return NextResponse.json({
      assigned: assignedLessons.map(al => ({
        ...al.lesson,
        moduleOrder: al.order,
      })),
      available: availableLessons,
    });
  } catch (error) {
    console.error('GET /api/modules/[id]/lessons error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
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
    const validationResult = assignLessonsSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { lessonIds, orders } = validationResult.data;

    // Verify module exists
    const moduleExists = await db
      .select({ id: modules.id })
      .from(modules)
      .where(eq(modules.id, moduleId))
      .limit(1);

    if (!moduleExists[0]) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    // Verify all lessons exist
    const existingLessons = await db
      .select({ id: lessons.id })
      .from(lessons)
      .where(sql`${lessons.id} IN (${sql.join(lessonIds.map(id => sql`${id}`), sql`, `)})`);

    if (existingLessons.length !== lessonIds.length) {
      return NextResponse.json({ error: 'Some lessons not found' }, { status: 404 });
    }

    // Insert module-lesson assignments
    const assignments = lessonIds.map((lessonId, index) => ({
      moduleId,
      lessonId,
      order: orders?.[index] ?? index,
    }));

    await db.insert(moduleLessons).values(assignments);

    return NextResponse.json({ 
      message: 'Lessons assigned successfully',
      assigned: assignments.length 
    });
  } catch (error) {
    console.error('POST /api/modules/[id]/lessons error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
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
    const validationResult = removeLessonSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { lessonId } = validationResult.data;

    // Remove the lesson from module
    const result = await db
      .delete(moduleLessons)
      .where(
        and(
          eq(moduleLessons.moduleId, moduleId),
          eq(moduleLessons.lessonId, lessonId)
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: 'Lesson assignment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Lesson removed from module successfully' });
  } catch (error) {
    console.error('DELETE /api/modules/[id]/lessons error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}