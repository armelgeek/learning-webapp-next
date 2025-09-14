import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/drizzle/db';
import { modules, moduleLessons, lessons, userProgress, userModuleProgress } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { updateModuleUseCase } from '@/features/modules/domain/use-cases/update-module.use-case';
import { deleteModuleUseCase } from '@/features/modules/domain/use-cases/delete-module.use-case';
import { updateModuleSchema } from '@/features/modules/config/module.schema';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // Get user session for progress tracking
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const userId = session?.user?.id;

    // Get module details
    const moduleResult = await db
      .select()
      .from(modules)
      .where(and(eq(modules.id, id), eq(modules.isActive, true)))
      .limit(1);

    if (!moduleResult[0]) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    const moduleData = moduleResult[0];

    // Get module lessons
    const moduleLessonsResult = await db
      .select({
        lesson: lessons,
        order: moduleLessons.order,
      })
      .from(moduleLessons)
      .innerJoin(lessons, eq(lessons.id, moduleLessons.lessonId))
      .where(eq(moduleLessons.moduleId, id))
      .orderBy(moduleLessons.order, lessons.order);

    let lessonsWithProgress = moduleLessonsResult.map(({ lesson, order }) => ({
      ...lesson,
      moduleOrder: order,
      completed: false,
      score: null as number | null,
    }));

    let moduleProgress = null;

    // If user is authenticated, get their progress
    if (userId) {
      // Get user progress for lessons
      const userProgressResults = await db
        .select()
        .from(userProgress)
        .where(eq(userProgress.userId, userId));

      const progressMap = new Map(
        userProgressResults.map(p => [p.lessonId, p])
      );

      lessonsWithProgress = lessonsWithProgress.map(lesson => ({
        ...lesson,
        completed: progressMap.get(lesson.id)?.completed || false,
        score: progressMap.get(lesson.id)?.score || null,
      }));

      // Get module progress
      const moduleProgressResult = await db
        .select()
        .from(userModuleProgress)
        .where(
          and(
            eq(userModuleProgress.userId, userId),
            eq(userModuleProgress.moduleId, id)
          )
        )
        .limit(1);

      moduleProgress = moduleProgressResult[0] || null;
    }

    // Calculate completion stats
    const totalLessons = lessonsWithProgress.length;
    const completedLessons = lessonsWithProgress.filter(l => l.completed).length;
    const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const moduleWithProgress = {
      ...moduleData,
      lessons: lessonsWithProgress,
      totalLessons,
      completedLessons,
      completionPercentage,
      status: moduleProgress?.status || 'locked',
      isUnlocked: moduleProgress?.status !== 'locked',
      unlockedAt: moduleProgress?.unlockedAt,
      completedAt: moduleProgress?.completedAt,
    };

    return NextResponse.json({
      success: true,
      data: moduleWithProgress,
    });
  } catch (error) {
    console.error('GET /api/modules/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    
    // Validate request body
    const validationResult = updateModuleSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid module data', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const result = await updateModuleUseCase(id, validationResult.data);
    
    if (!result.success) {
      console.error('Error updating module:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('PUT /api/modules/[id] error:', error);
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

    const { id } = await context.params;

    const result = await deleteModuleUseCase(id);
    
    if (!result.success) {
      console.error('Error deleting module:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Module deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/modules/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}