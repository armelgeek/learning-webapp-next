import { db } from '@/drizzle/db';
import { lessons, userProgress, modules, moduleLessons, users } from '@/drizzle/schema';
import { and, desc, eq, sql, count, inArray } from 'drizzle-orm';
import { CreateLessonPayload, UpdateLessonPayload, LessonFilter, PrerequisiteCheck, LessonWithProgress, LessonContent } from '../config/lesson.types';

export class LessonService {
  static async getLessons(filter?: LessonFilter) {
    const conditions = [];

    if (filter?.language) {
      conditions.push(eq(lessons.language, filter.language));
    }
    if (filter?.type) {
      conditions.push(eq(lessons.type, filter.type));
    }
    if (filter?.difficultyLevel) {
      conditions.push(eq(lessons.difficultyLevel, filter.difficultyLevel));
    }
    if (filter?.isActive !== undefined) {
      conditions.push(eq(lessons.isActive, filter.isActive));
    }

    const result = await db
      .select({
        id: lessons.id,
        title: lessons.title,
        description: lessons.description,
        language: lessons.language,
        type: lessons.type,
        content: lessons.content,
        audioUrl: lessons.audioUrl,
        videoUrl: lessons.videoUrl,
        imageUrl: lessons.imageUrl,
        difficultyLevel: lessons.difficultyLevel,
        estimatedDuration: lessons.estimatedDuration,
        pointsReward: lessons.pointsReward,
        isActive: lessons.isActive,
        order: lessons.order,
        prerequisites: lessons.prerequisites,
        tags: lessons.tags,
        createdAt: lessons.createdAt,
        updatedAt: lessons.updatedAt,
      })
      .from(lessons)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(lessons.order, lessons.createdAt);

    // Convert Date objects to ISO strings for JSON serialization
    return result.map(lesson => ({
      ...lesson,
      content: lesson.content as LessonContent,
      prerequisites: lesson.prerequisites ? JSON.parse(lesson.prerequisites) : [],
      tags: lesson.tags ? JSON.parse(lesson.tags) : [],
      createdAt: lesson.createdAt?.toISOString() || null,
      updatedAt: lesson.updatedAt?.toISOString() || null,
    }));
  }

  static async getLessonById(id: string) {
    const result = await db
      .select({
        id: lessons.id,
        title: lessons.title,
        description: lessons.description,
        language: lessons.language,
        type: lessons.type,
        content: lessons.content,
        audioUrl: lessons.audioUrl,
        videoUrl: lessons.videoUrl,
        imageUrl: lessons.imageUrl,
        difficultyLevel: lessons.difficultyLevel,
        estimatedDuration: lessons.estimatedDuration,
        pointsReward: lessons.pointsReward,
        isActive: lessons.isActive,
        order: lessons.order,
        prerequisites: lessons.prerequisites,
        tags: lessons.tags,
        createdAt: lessons.createdAt,
        updatedAt: lessons.updatedAt,
        moduleId: moduleLessons.moduleId, // Include module ID if lesson is in a module
        moduleTitle: modules.title, // Include module title for display
      })
      .from(lessons)
      .leftJoin(moduleLessons, eq(moduleLessons.lessonId, lessons.id))
      .leftJoin(modules, eq(modules.id, moduleLessons.moduleId))
      .where(eq(lessons.id, id))
      .limit(1);

    const lesson = result[0];
    if (!lesson) return null;

    // Convert Date objects to ISO strings for JSON serialization
    return {
      ...lesson,
      content: lesson.content as LessonContent,
      prerequisites: lesson.prerequisites ? JSON.parse(lesson.prerequisites) : [],
      tags: lesson.tags ? JSON.parse(lesson.tags) : [],
      createdAt: lesson.createdAt?.toISOString() || null,
      updatedAt: lesson.updatedAt?.toISOString() || null,
      moduleId: lesson.moduleId || undefined, // Make it undefined if null for better form handling
    };
  }

  static async getLessonWithProgress(lessonId: string, userId: string) {
    const result = await db
      .select({
        lesson: lessons,
        progress: userProgress,
      })
      .from(lessons)
      .leftJoin(
        userProgress,
        and(
          eq(userProgress.lessonId, lessons.id),
          eq(userProgress.userId, userId)
        )
      )
      .where(eq(lessons.id, lessonId))
      .limit(1);

    return result[0] || null;
  }

  static async createLesson(data: CreateLessonPayload) {
    // Validate prerequisites exist if provided
    if (data.prerequisites && data.prerequisites.length > 0) {
      const existingLessons = await db
        .select({ id: lessons.id })
        .from(lessons)
        .where(inArray(lessons.id, data.prerequisites));
      
      if (existingLessons.length !== data.prerequisites.length) {
        throw new Error('Some prerequisite lessons do not exist');
      }
    }

    // Validate module exists if provided
    if (data.moduleId) {
      const moduleExists = await db
        .select({ id: modules.id })
        .from(modules)
        .where(eq(modules.id, data.moduleId))
        .limit(1);
      
      if (moduleExists.length === 0) {
        throw new Error('Module does not exist');
      }
    }

    // Extract moduleId from data before inserting lesson (since it's not a lesson field)
    const { moduleId, ...lessonData } = data;

    const result = await db
      .insert(lessons)
      .values({
        ...lessonData,
        prerequisites: lessonData.prerequisites ? JSON.stringify(lessonData.prerequisites) : null,
        tags: lessonData.tags ? JSON.stringify(lessonData.tags) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    const newLesson = result[0];

    // If a moduleId was provided, create the module-lesson relationship
    if (moduleId) {
      // Get the current highest order for lessons in this module
      const moduleOrderQuery = await db
        .select({ maxOrder: sql<number>`COALESCE(MAX(${moduleLessons.order}), -1)` })
        .from(moduleLessons)
        .where(eq(moduleLessons.moduleId, moduleId));
      
      const nextOrder = (moduleOrderQuery[0]?.maxOrder || -1) + 1;

      await db
        .insert(moduleLessons)
        .values({
          moduleId,
          lessonId: newLesson.id,
          order: nextOrder,
        });
    }

    return newLesson;
  }

  static async updateLesson(id: string, data: Partial<UpdateLessonPayload>) {
    // Validate prerequisites exist if provided
    if (data.prerequisites && data.prerequisites.length > 0) {
      const existingLessons = await db
        .select({ id: lessons.id })
        .from(lessons)
        .where(inArray(lessons.id, data.prerequisites));
      
      if (existingLessons.length !== data.prerequisites.length) {
        throw new Error('Some prerequisite lessons do not exist');
      }
    }

    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    };

    if (data.prerequisites !== undefined) {
      updateData.prerequisites = data.prerequisites ? JSON.stringify(data.prerequisites) : null;
    }

    if (data.tags !== undefined) {
      updateData.tags = data.tags ? JSON.stringify(data.tags) : null;
    }

    const result = await db
      .update(lessons)
      .set(updateData)
      .where(eq(lessons.id, id))
      .returning();

    return result[0] || null;
  }

  static async deleteLesson(id: string) {
    const result = await db
      .delete(lessons)
      .where(eq(lessons.id, id))
      .returning();

    return result[0] || null;
  }

  static async checkPrerequisites(lessonId: string, userId: string): Promise<PrerequisiteCheck> {
    // Get the lesson and its prerequisites
    const lesson = await this.getLessonById(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    const prerequisites = lesson.prerequisites || [];
    
    if (prerequisites.length === 0) {
      return {
        lessonId,
        isUnlocked: true,
        unmetPrerequisites: [],
        prerequisiteDetails: [],
      };
    }

    // Get prerequisite lessons and user progress for them
    const prerequisiteData = await db
      .select({
        lesson: {
          id: lessons.id,
          title: lessons.title,
        },
        progress: userProgress,
      })
      .from(lessons)
      .leftJoin(
        userProgress,
        and(
          eq(userProgress.lessonId, lessons.id),
          eq(userProgress.userId, userId)
        )
      )
      .where(inArray(lessons.id, prerequisites));

    const prerequisiteDetails = prerequisiteData.map(item => ({
      id: item.lesson.id,
      title: item.lesson.title,
      completed: item.progress?.completed || false,
    }));

    const unmetPrerequisites = prerequisiteDetails
      .filter(prereq => !prereq.completed)
      .map(prereq => prereq.id);

    return {
      lessonId,
      isUnlocked: unmetPrerequisites.length === 0,
      unmetPrerequisites,
      prerequisiteDetails,
    };
  }

  static async getLessonsWithUserProgress(userId: string, filter?: LessonFilter): Promise<LessonWithProgress[]> {
    const conditions = [];

    if (filter?.language) {
      conditions.push(eq(lessons.language, filter.language));
    }
    if (filter?.type) {
      conditions.push(eq(lessons.type, filter.type));
    }
    if (filter?.difficultyLevel) {
      conditions.push(eq(lessons.difficultyLevel, filter.difficultyLevel));
    }
    if (filter?.isActive !== undefined) {
      conditions.push(eq(lessons.isActive, filter.isActive));
    }

    const result = await db
      .select({
        lesson: lessons,
        progress: userProgress,
      })
      .from(lessons)
      .leftJoin(
        userProgress,
        and(
          eq(userProgress.lessonId, lessons.id),
          eq(userProgress.userId, userId)
        )
      )
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(lessons.order, lessons.createdAt);

    // Process each lesson to check prerequisites
    const lessonsWithProgress: LessonWithProgress[] = [];
    
    for (const item of result) {
      const lesson = item.lesson;
      const progress = item.progress;
      
      // Check prerequisites for this lesson
      const prerequisiteCheck = await this.checkPrerequisites(lesson.id, userId);
      
      lessonsWithProgress.push({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description || undefined,
        language: lesson.language,
        type: lesson.type,
        content: lesson.content as LessonContent,
        audioUrl: lesson.audioUrl || undefined,
        videoUrl: lesson.videoUrl || undefined,
        imageUrl: lesson.imageUrl || undefined,
        difficultyLevel: lesson.difficultyLevel,
        estimatedDuration: lesson.estimatedDuration,
        pointsReward: lesson.pointsReward,
        isActive: lesson.isActive,
        order: lesson.order,
        prerequisites: lesson.prerequisites ? JSON.parse(lesson.prerequisites) : [],
        tags: lesson.tags ? JSON.parse(lesson.tags) : [],
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt,
        progress: progress ? {
          id: progress.id,
          completed: progress.completed,
          score: progress.score || undefined,
          attempts: progress.attempts,
          completedAt: progress.completedAt || undefined,
        } : undefined,
        isUnlocked: prerequisiteCheck.isUnlocked,
        unmetPrerequisites: prerequisiteCheck.unmetPrerequisites,
      });
    }

    return lessonsWithProgress;
  }

  // Alternative implementation using LEFT JOIN instead of subquery
  static async getLessonsForAdmin(filter?: LessonFilter) {
    const conditions = [];

    if (filter?.language) {
      conditions.push(eq(lessons.language, filter.language));
    }
    if (filter?.type) {
      conditions.push(eq(lessons.type, filter.type));
    }
    if (filter?.difficultyLevel) {
      conditions.push(eq(lessons.difficultyLevel, filter.difficultyLevel));
    }
    if (filter?.isActive !== undefined) {
      conditions.push(eq(lessons.isActive, filter.isActive));
    }

    const result = await db
      .select({
        id: lessons.id,
        title: lessons.title,
        description: lessons.description,
        language: lessons.language,
        type: lessons.type,
        content: lessons.content,
        audioUrl: lessons.audioUrl,
        videoUrl: lessons.videoUrl,
        imageUrl: lessons.imageUrl,
        difficultyLevel: lessons.difficultyLevel,
        estimatedDuration: lessons.estimatedDuration,
        pointsReward: lessons.pointsReward,
        isActive: lessons.isActive,
        order: lessons.order,
        prerequisites: lessons.prerequisites,
        tags: lessons.tags,
        createdAt: lessons.createdAt,
        updatedAt: lessons.updatedAt,
        moduleTitle: sql<string | null>`COALESCE(${modules.title}, 'No Module')`,
      })
      .from(lessons)
      .leftJoin(moduleLessons, eq(moduleLessons.lessonId, lessons.id))
      .leftJoin(modules, eq(modules.id, moduleLessons.moduleId))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(lessons.order, lessons.createdAt);

    // Convert Date objects to ISO strings for JSON serialization
    return result.map(lesson => ({
      ...lesson,
      content: lesson.content as LessonContent,
      prerequisites: lesson.prerequisites ? JSON.parse(lesson.prerequisites) : [],
      tags: lesson.tags ? JSON.parse(lesson.tags) : [],
      createdAt: lesson.createdAt?.toISOString() || null,
      updatedAt: lesson.updatedAt?.toISOString() || null,
    }));
  }

  static async getAvailableLessonsForPrerequisites(excludeLessonId?: string) {
    const conditions = [eq(lessons.isActive, true)];
    
    if (excludeLessonId) {
      conditions.push(sql`${lessons.id} != ${excludeLessonId}`);
    }

    const result = await db
      .select({
        id: lessons.id,
        title: lessons.title,
        language: lessons.language,
        type: lessons.type,
        difficultyLevel: lessons.difficultyLevel,
        order: lessons.order,
      })
      .from(lessons)
      .where(and(...conditions))
      .orderBy(lessons.order, lessons.title);

    return result;
  }

  static async getAvailableModules() {
    const result = await db
      .select({
        id: modules.id,
        title: modules.title,
        description: modules.description,
        language: modules.language,
        difficultyLevel: modules.difficultyLevel,
        order: modules.order,
      })
      .from(modules)
      .where(eq(modules.isActive, true))
      .orderBy(modules.order, modules.title);

    return result;
  }
}