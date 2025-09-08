import { db } from '@/drizzle/db';
import { lessons, userLessonProgress } from '@/drizzle/schema';
import { and, eq, ilike, or, desc, asc, sql, count } from 'drizzle-orm';
import type { 
  CreateLessonInput, 
  UpdateLessonInput, 
  LessonQuery, 
  LessonWithProgress,
  LessonQueryResult,
  LessonProgressInput 
} from '../config/lesson.types';

export class LessonService {
  // Get lessons with optional filtering and pagination
  static async getLessons(query: LessonQuery, userId?: string): Promise<LessonQueryResult> {
    const {
      language,
      difficulty,
      lessonType,
      tags,
      page = 1,
      pageSize = 10,
      search
    } = query;

    const offset = (page - 1) * pageSize;
    
    // Build where conditions
    const whereConditions = [
      eq(lessons.isActive, true)
    ];

    if (language) {
      whereConditions.push(eq(lessons.language, language));
    }
    if (difficulty) {
      whereConditions.push(eq(lessons.difficulty, difficulty));
    }
    if (lessonType) {
      whereConditions.push(eq(lessons.lessonType, lessonType));
    }
    if (search) {
      whereConditions.push(
        or(
          ilike(lessons.title, `%${search}%`),
          ilike(lessons.description, `%${search}%`)
        )
      );
    }
    if (tags && tags.length > 0) {
      // PostgreSQL array overlap operator
      whereConditions.push(sql`${lessons.tags} && ${tags}`);
    }

    // Get lessons with progress if userId provided
    const lessonsQuery = db
      .select({
        lesson: lessons,
        progress: userId ? userLessonProgress : undefined
      })
      .from(lessons)
      .where(and(...whereConditions))
      .orderBy(asc(lessons.order), desc(lessons.createdAt))
      .limit(pageSize)
      .offset(offset);

    if (userId) {
      lessonsQuery.leftJoin(
        userLessonProgress,
        and(
          eq(userLessonProgress.lessonId, lessons.id),
          eq(userLessonProgress.userId, userId)
        )
      );
    }

    const results = await lessonsQuery.execute();

    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(lessons)
      .where(and(...whereConditions))
      .execute();

    const total = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(total / pageSize);

    const lessonsWithProgress: LessonWithProgress[] = results.map(result => ({
      ...result.lesson,
      progress: result.progress || undefined
    }));

    return {
      lessons: lessonsWithProgress,
      total,
      page,
      pageSize,
      totalPages
    };
  }

  // Get a single lesson by ID
  static async getLessonById(id: string, userId?: string): Promise<LessonWithProgress | null> {
    const query = db
      .select({
        lesson: lessons,
        progress: userId ? userLessonProgress : undefined
      })
      .from(lessons)
      .where(and(eq(lessons.id, id), eq(lessons.isActive, true)))
      .limit(1);

    if (userId) {
      query.leftJoin(
        userLessonProgress,
        and(
          eq(userLessonProgress.lessonId, lessons.id),
          eq(userLessonProgress.userId, userId)
        )
      );
    }

    const results = await query.execute();
    const result = results[0];

    if (!result) return null;

    return {
      ...result.lesson,
      progress: result.progress || undefined
    };
  }

  // Create a new lesson
  static async createLesson(input: CreateLessonInput, createdBy?: string): Promise<string> {
    const lessonData = {
      ...input,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db
      .insert(lessons)
      .values(lessonData)
      .returning({ id: lessons.id })
      .execute();

    return result[0].id;
  }

  // Update a lesson
  static async updateLesson(input: UpdateLessonInput): Promise<boolean> {
    const { id, ...updateData } = input;
    
    const result = await db
      .update(lessons)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(lessons.id, id))
      .returning({ id: lessons.id })
      .execute();

    return result.length > 0;
  }

  // Delete a lesson (soft delete by setting isActive to false)
  static async deleteLesson(id: string): Promise<boolean> {
    const result = await db
      .update(lessons)
      .set({
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(lessons.id, id))
      .returning({ id: lessons.id })
      .execute();

    return result.length > 0;
  }

  // Mark lesson as completed
  static async markLessonCompleted(input: LessonProgressInput, userId: string): Promise<boolean> {
    const { lessonId, timeSpent } = input;

    // Check if progress record exists
    const existingProgress = await db
      .select()
      .from(userLessonProgress)
      .where(
        and(
          eq(userLessonProgress.userId, userId),
          eq(userLessonProgress.lessonId, lessonId)
        )
      )
      .limit(1)
      .execute();

    const now = new Date();

    if (existingProgress.length > 0) {
      // Update existing record
      await db
        .update(userLessonProgress)
        .set({
          isCompleted: true,
          completedAt: now,
          timeSpent,
          updatedAt: now
        })
        .where(eq(userLessonProgress.id, existingProgress[0].id))
        .execute();
    } else {
      // Create new progress record
      await db
        .insert(userLessonProgress)
        .values({
          userId,
          lessonId,
          isCompleted: true,
          completedAt: now,
          timeSpent,
          createdAt: now,
          updatedAt: now
        })
        .execute();
    }

    return true;
  }

  // Get user's lesson progress
  static async getUserProgress(userId: string, lessonId?: string) {
    const whereConditions = [eq(userLessonProgress.userId, userId)];
    
    if (lessonId) {
      whereConditions.push(eq(userLessonProgress.lessonId, lessonId));
    }

    return await db
      .select()
      .from(userLessonProgress)
      .where(and(...whereConditions))
      .execute();
  }

  // Get lessons by language for a specific difficulty level
  static async getLessonsByLanguageAndDifficulty(
    language: string,
    difficulty: string,
    userId?: string
  ): Promise<LessonWithProgress[]> {
    return (await this.getLessons({
      language: language as any,
      difficulty: difficulty as any,
      page: 1,
      pageSize: 100
    }, userId)).lessons;
  }
}