import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/drizzle/db';
import { achievements, userAchievements } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const earned = searchParams.get('earned');

    if (earned === 'true') {
      // Get earned achievements for the user
      const userEarnedAchievements = await db
        .select({
          achievement: achievements,
          earnedAt: userAchievements.earnedAt,
        })
        .from(userAchievements)
        .innerJoin(achievements, eq(achievements.id, userAchievements.achievementId))
        .where(eq(userAchievements.userId, session.user.id))
        .orderBy(userAchievements.earnedAt);

      return NextResponse.json({
        success: true,
        data: userEarnedAchievements,
      });
    } else {
      // Get all available achievements
      const allAchievements = await db
        .select()
        .from(achievements)
        .where(eq(achievements.isActive, true))
        .orderBy(achievements.createdAt);

      // Check which ones are earned by the user
      const earnedIds = await db
        .select({ achievementId: userAchievements.achievementId })
        .from(userAchievements)
        .where(eq(userAchievements.userId, session.user.id));

      const earnedSet = new Set(earnedIds.map(e => e.achievementId));

      const achievementsWithStatus = allAchievements.map(achievement => ({
        ...achievement,
        isEarned: earnedSet.has(achievement.id),
      }));

      return NextResponse.json({
        success: true,
        data: achievementsWithStatus,
      });
    }
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { achievementId } = body;

    if (!achievementId) {
      return NextResponse.json(
        { error: 'Achievement ID is required' },
        { status: 400 }
      );
    }

    // Check if achievement exists
    const achievement = await db
      .select()
      .from(achievements)
      .where(and(eq(achievements.id, achievementId), eq(achievements.isActive, true)))
      .limit(1);

    if (!achievement[0]) {
      return NextResponse.json(
        { error: 'Achievement not found' },
        { status: 404 }
      );
    }

    // Check if user already earned this achievement
    const existingUserAchievement = await db
      .select()
      .from(userAchievements)
      .where(
        and(
          eq(userAchievements.userId, session.user.id),
          eq(userAchievements.achievementId, achievementId)
        )
      )
      .limit(1);

    if (existingUserAchievement[0]) {
      return NextResponse.json(
        { error: 'Achievement already earned' },
        { status: 400 }
      );
    }

    // Award the achievement
    const newUserAchievement = await db
      .insert(userAchievements)
      .values({
        userId: session.user.id,
        achievementId,
        earnedAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: {
        ...newUserAchievement[0],
        achievement: achievement[0],
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error awarding achievement:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}