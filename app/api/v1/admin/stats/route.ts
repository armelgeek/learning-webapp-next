import { NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { 
  lessons, 
  users, 
  achievements, 
  forumTopics,
  userProgress
} from '@/drizzle/schema';
import { count, sql, eq, desc, gte } from 'drizzle-orm';

export async function GET() {
  try {
    // Get total lessons count
    const totalLessonsResult = await db
      .select({ count: count() })
      .from(lessons)
      .where(eq(lessons.isActive, true));

    // Get active users count (users who have made progress in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsersResult = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${userProgress.userId})` })
      .from(userProgress)
      .where(gte(userProgress.updatedAt, thirtyDaysAgo.toISOString()));

    // Get total achievements count
    const totalAchievementsResult = await db
      .select({ count: count() })
      .from(achievements)
      .where(eq(achievements.isActive, true));

    // Get total forum posts count
    const totalForumPostsResult = await db
      .select({ count: count() })
      .from(forumTopics);

    // Get total registered users
    const totalUsersResult = await db
      .select({ count: count() })
      .from(users);

    // Get lessons completion statistics
    const lessonsCompletedResult = await db
      .select({ count: count() })
      .from(userProgress)
      .where(eq(userProgress.completed, true));

    // Get language distribution
    const languageDistribution = await db
      .select({
        language: lessons.language,
        count: count()
      })
      .from(lessons)
      .where(eq(lessons.isActive, true))
      .groupBy(lessons.language)
      .orderBy(desc(count()));

    // Get lesson type distribution
    const lessonTypeDistribution = await db
      .select({
        type: lessons.type,
        count: count()
      })
      .from(lessons)
      .where(eq(lessons.isActive, true))
      .groupBy(lessons.type)
      .orderBy(desc(count()));

    // Get recent user registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentUsersResult = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, sevenDaysAgo.toISOString()));

    return NextResponse.json({
      success: true,
      stats: {
        totalLessons: totalLessonsResult[0]?.count || 0,
        activeUsers: activeUsersResult[0]?.count || 0,
        totalAchievements: totalAchievementsResult[0]?.count || 0,
        totalForumPosts: totalForumPostsResult[0]?.count || 0,
        totalUsers: totalUsersResult[0]?.count || 0,
        lessonsCompleted: lessonsCompletedResult[0]?.count || 0,
        recentUsers: recentUsersResult[0]?.count || 0,
        languageDistribution,
        lessonTypeDistribution,
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}