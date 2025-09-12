import { db } from '@/drizzle/db';
import { lessons, userProgress } from '@/drizzle/schema';
import { and, desc, eq, sql } from 'drizzle-orm';
import { CreateLessonPayload, UpdateLessonPayload, LessonFilter } from '../config/lesson.types';

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
      })
      .from(lessons)
      .where(eq(lessons.id, id))
      .limit(1);
    
    const lesson = result[0];
    if (!lesson) return null;

    // Convert Date objects to ISO strings for JSON serialization
    return {
      ...lesson,
      createdAt: lesson.createdAt?.toISOString() || null,
      updatedAt: lesson.updatedAt?.toISOString() || null,
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
    const result = await db
      .insert(lessons)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return result[0];
  }

  static async updateLesson(id: string, data: Partial<UpdateLessonPayload>) {
    const result = await db
      .update(lessons)
      .set({
        ...data,
        updatedAt: new Date(),
      })
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

  static async getLessonsWithUserProgress(userId: string, filter?: LessonFilter) {
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

    return await db
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
  }
}