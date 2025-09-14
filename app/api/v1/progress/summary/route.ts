import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/drizzle/db';
import { 
  userStats, 
  userProgress, 
  userModuleProgress, 
  userAchievements, 
  userDailyChallenges,
  lessons,
  modules,
  achievements
} from '@/drizzle/schema';
import { eq, and, gte, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user stats
    const userStatsResult = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    const stats = userStatsResult[0] || {
      streakDays: 0,
      longestStreak: 0,
      totalLessonsCompleted: 0,
      totalWordsLearned: 0,
      totalStudyTime: 0,
      totalPoints: 0,
      weeklyPoints: 0,
      monthlyPoints: 0,
      level: 1,
      experience: 0,
      dailyGoal: 15,
      weeklyGoal: 105,
    };

    // Get recent lessons completed (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentLessons = await db
      .select({
        lesson: lessons,
        completedAt: userProgress.completedAt,
        score: userProgress.score,
      })
      .from(userProgress)
      .innerJoin(lessons, eq(lessons.id, userProgress.lessonId))
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.completed, true),
          gte(userProgress.completedAt, sevenDaysAgo)
        )
      )
      .orderBy(desc(userProgress.completedAt))
      .limit(10);

    // Get completed modules
    const completedModulesResult = await db
      .select({
        module: modules,
        completedAt: userModuleProgress.completedAt,
      })
      .from(userModuleProgress)
      .innerJoin(modules, eq(modules.id, userModuleProgress.moduleId))
      .where(
        and(
          eq(userModuleProgress.userId, userId),
          eq(userModuleProgress.status, 'completed')
        )
      )
      .orderBy(desc(userModuleProgress.completedAt))
      .limit(5);

    // Get recent achievements (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentAchievements = await db
      .select({
        achievement: achievements,
        earnedAt: userAchievements.earnedAt,
      })
      .from(userAchievements)
      .innerJoin(achievements, eq(achievements.id, userAchievements.achievementId))
      .where(
        and(
          eq(userAchievements.userId, userId),
          gte(userAchievements.earnedAt, thirtyDaysAgo)
        )
      )
      .orderBy(desc(userAchievements.earnedAt))
      .limit(5);

    // Get daily challenge progress for current week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weeklyProgress = await db
      .select({
        completed: userDailyChallenges.completed,
        currentProgress: userDailyChallenges.currentProgress,
      })
      .from(userDailyChallenges)
      .where(
        and(
          eq(userDailyChallenges.userId, userId),
          gte(userDailyChallenges.createdAt, weekStart)
        )
      );

    // Calculate weekly study time (from recent lessons)
    const weeklyStudyTime = recentLessons.reduce((total, lesson) => {
      return total + (lesson.lesson.estimatedDuration || 0);
    }, 0);

    // Calculate progress toward goals
    const dailyProgress = Math.min((weeklyStudyTime / 7) / stats.dailyGoal * 100, 100);
    const weeklyProgress = Math.min(weeklyStudyTime / stats.weeklyGoal * 100, 100);

    // Learning insights
    const insights = {
      mostActiveDay: 'Monday', // This could be calculated from actual data
      favoriteLanguage: 'English', // This could be calculated from lessons completed
      averageScore: recentLessons.length > 0 
        ? Math.round(recentLessons.reduce((sum, l) => sum + (l.score || 0), 0) / recentLessons.length)
        : 0,
      completionRate: recentLessons.length > 0 ? 100 : 0, // Since we only fetch completed lessons
    };

    const summary = {
      stats,
      recentActivity: {
        lessons: recentLessons,
        modules: completedModulesResult,
        achievements: recentAchievements,
      },
      goals: {
        daily: {
          target: stats.dailyGoal,
          progress: Math.round(dailyProgress),
          achieved: dailyProgress >= 100,
        },
        weekly: {
          target: stats.weeklyGoal,
          progress: Math.round(weeklyProgress),
          achieved: weeklyProgress >= 100,
        },
      },
      insights,
      challengesCompleted: weeklyProgress.filter(p => p.completed).length,
      totalChallengesThisWeek: weeklyProgress.length,
    };

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Error fetching progress summary:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}