import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/drizzle/db';
import { users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { ProgressService } from '@/features/progress/domain/service';
import { updateProfileSchema } from '@/features/profile/config/profile.schema';

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

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body
    const validationResult = updateProfileSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid profile data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Update user profile
    const updatedUser = await db
      .update(users)
      .set({
        ...data,
        targetLanguages: JSON.stringify(data.targetLanguages),
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))
      .returning();

    if (!updatedUser[0]) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: updatedUser[0],
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}