import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/drizzle/db';
import { users, userStats } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { updateLearningGoalsSchema } from '@/features/profile/config/profile.schema';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get learning goals from user profile and user stats
    const userResult = await db
      .select({
        learningGoal: users.learningGoal,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    const userStatsResult = await db
      .select({
        dailyGoal: userStats.dailyGoal,
        weeklyGoal: userStats.weeklyGoal,
      })
      .from(userStats)
      .where(eq(userStats.userId, session.user.id))
      .limit(1);

    return NextResponse.json({
      success: true,
      data: {
        learningGoal: userResult[0]?.learningGoal || '',
        dailyGoal: userStatsResult[0]?.dailyGoal || 15,
        weeklyGoal: userStatsResult[0]?.weeklyGoal || 105,
      },
    });
  } catch (error) {
    console.error('Error fetching learning goals:', error);
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
    const validationResult = updateLearningGoalsSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid learning goals data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Update learning goal in users table
    if (data.learningGoal !== undefined) {
      await db
        .update(users)
        .set({
          learningGoal: data.learningGoal,
          updatedAt: new Date(),
        })
        .where(eq(users.id, session.user.id));
    }

    // Update daily and weekly goals in user stats
    const statsUpdate: Record<string, unknown> = {};
    if (data.dailyGoal !== undefined) {
      statsUpdate.dailyGoal = data.dailyGoal;
    }
    if (data.weeklyGoal !== undefined) {
      statsUpdate.weeklyGoal = data.weeklyGoal;
    }

    if (Object.keys(statsUpdate).length > 0) {
      statsUpdate.updatedAt = new Date();
      
      // Check if user stats exist
      const existingStats = await db
        .select()
        .from(userStats)
        .where(eq(userStats.userId, session.user.id))
        .limit(1);

      if (existingStats.length > 0) {
        // Update existing stats
        await db
          .update(userStats)
          .set(statsUpdate)
          .where(eq(userStats.userId, session.user.id));
      } else {
        // Create new stats record
        await db
          .insert(userStats)
          .values({
            userId: session.user.id,
            ...statsUpdate,
            createdAt: new Date(),
          });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Learning goals updated successfully',
        updatedGoals: data,
      },
    });
  } catch (error) {
    console.error('Error updating learning goals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}