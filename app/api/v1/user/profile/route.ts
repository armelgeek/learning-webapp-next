import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/drizzle/db';
import { users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { ProgressService } from '@/features/progress/domain/service';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user basic info
    const userResult = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        nativeLanguage: users.nativeLanguage,
        targetLanguages: users.targetLanguages,
        currentLevel: users.currentLevel,
        learningGoal: users.learningGoal,
        bio: users.bio,
        country: users.country,
        timezone: users.timezone,
        age: users.age,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!userResult[0]) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user stats
    const userStats = await ProgressService.getUserStats(session.user.id);

    // Get progress summary
    const progressSummary = await ProgressService.getProgressSummary(session.user.id);

    return NextResponse.json({
      success: true,
      data: {
        user: userResult[0],
        stats: userStats || {
          streakDays: 0,
          longestStreak: 0,
          totalLessonsCompleted: 0,
          totalWordsLearned: 0,
          totalStudyTime: 0,
          currentLevel: 'beginner',
          totalPoints: 0,
          weeklyPoints: 0,
          monthlyPoints: 0,
          level: 1,
          experience: 0,
          experienceToNextLevel: 100,
          dailyGoal: 15,
          weeklyGoal: 105,
          lastPracticeDate: null,
        },
        progressSummary,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}