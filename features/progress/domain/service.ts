import { db } from '@/drizzle/db';
import { userProgress, userStats, lessons } from '@/drizzle/schema';
import { and, avg, count, desc, eq, sql } from 'drizzle-orm';
import { CreateProgressPayload, UpdateProgressPayload, ProgressFilter, UpdateUserStatsPayload } from '../config/progress.types';

export class ProgressService {
  static async getUserProgress(userId: string, lessonId?: string) {
    const conditions = [eq(userProgress.userId, userId)];
    
    if (lessonId) {
      conditions.push(eq(userProgress.lessonId, lessonId));
    }

    const result = await db
      .select({
        id: userProgress.id,
        userId: userProgress.userId,
        lessonId: userProgress.lessonId,
        completed: userProgress.completed,
        score: userProgress.score,
        attempts: userProgress.attempts,
        completedAt: userProgress.completedAt,
        createdAt: userProgress.createdAt,
        updatedAt: userProgress.updatedAt,
      })
      .from(userProgress)
      .where(and(...conditions))
      .orderBy(desc(userProgress.updatedAt));

    // Convert Date objects to ISO strings for JSON serialization
    return result.map(progress => ({
      ...progress,
      completedAt: progress.completedAt?.toISOString() || null,
      createdAt: progress.createdAt?.toISOString() || null,
      updatedAt: progress.updatedAt?.toISOString() || null,
    }));
  }

  static async createOrUpdateProgress(data: CreateProgressPayload | UpdateProgressPayload) {
    // Try to find existing progress
    const existing = await db
      .select({ id: userProgress.id })
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, data.userId),
          eq(userProgress.lessonId, data.lessonId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Update existing progress
      const result = await db
        .update(userProgress)
        .set({
          ...data,
          attempts: sql`${userProgress.attempts} + 1`,
          completedAt: data.completed ? new Date() : null,
          updatedAt: new Date(),
        })
        .where(eq(userProgress.id, existing[0].id))
        .returning({
          id: userProgress.id,
          userId: userProgress.userId,
          lessonId: userProgress.lessonId,
          completed: userProgress.completed,
          score: userProgress.score,
          attempts: userProgress.attempts,
          completedAt: userProgress.completedAt,
          createdAt: userProgress.createdAt,
          updatedAt: userProgress.updatedAt,
        });

      const progress = result[0];
      return {
        ...progress,
        completedAt: progress.completedAt?.toISOString() || null,
        createdAt: progress.createdAt?.toISOString() || null,
        updatedAt: progress.updatedAt?.toISOString() || null,
      };
    } else {
      // Create new progress
      const result = await db
        .insert(userProgress)
        .values({
          ...data,
          attempts: 'attempts' in data ? data.attempts : 1,
          completedAt: data.completed ? new Date() : null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({
          id: userProgress.id,
          userId: userProgress.userId,
          lessonId: userProgress.lessonId,
          completed: userProgress.completed,
          score: userProgress.score,
          attempts: userProgress.attempts,
          completedAt: userProgress.completedAt,
          createdAt: userProgress.createdAt,
          updatedAt: userProgress.updatedAt,
        });

      const progress = result[0];
      return {
        ...progress,
        completedAt: progress.completedAt?.toISOString() || null,
        createdAt: progress.createdAt?.toISOString() || null,
        updatedAt: progress.updatedAt?.toISOString() || null,
      };
    }
  }
  }

  static async getUserStats(userId: string) {
    const result = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    return result[0] || null;
  }

  static async createOrUpdateUserStats(data: UpdateUserStatsPayload) {
    const existing = await this.getUserStats(data.userId);

    if (existing) {
      const result = await db
        .update(userStats)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(userStats.userId, data.userId))
        .returning();

      return result[0];
    } else {
      const result = await db
        .insert(userStats)
        .values({
          userId: data.userId,
          streakDays: data.streakDays || 0,
          totalLessonsCompleted: data.totalLessonsCompleted || 0,
          totalWordsLearned: data.totalWordsLearned || 0,
          currentLevel: data.currentLevel || 'beginner',
          lastPracticeDate: data.lastPracticeDate,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return result[0];
    }
  }

  static async getProgressSummary(userId: string) {
    // Get total and completed lessons count
    const lessonStats = await db
      .select({
        totalLessons: count(lessons.id),
        completedLessons: count(userProgress.id),
        averageScore: avg(userProgress.score),
      })
      .from(lessons)
      .leftJoin(
        userProgress,
        and(
          eq(userProgress.lessonId, lessons.id),
          eq(userProgress.userId, userId),
          eq(userProgress.completed, true)
        )
      );

    // Get user stats
    const stats = await this.getUserStats(userId);

    // Get recent activity
    const recentActivity = await this.getUserProgress(userId);

    return {
      totalLessons: lessonStats[0]?.totalLessons || 0,
      completedLessons: lessonStats[0]?.completedLessons || 0,
      averageScore: Math.round(Number(lessonStats[0]?.averageScore) || 0),
      streak: stats?.streakDays || 0,
      level: stats?.currentLevel || 'beginner',
      recentActivity: recentActivity.slice(0, 10), // Last 10 activities
    };
  }

  static calculateStreak(lastPracticeDate?: Date): number {
    if (!lastPracticeDate) return 0;

    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastPracticeDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // If the last practice was today or yesterday, maintain streak
    if (diffDays <= 1) {
      return 1; // This should be calculated based on historical data
    }
    
    return 0; // Streak broken
  }
}