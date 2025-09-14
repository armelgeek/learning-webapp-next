import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/drizzle/db';
import { dailyChallenges, userDailyChallenges } from '@/drizzle/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const language = searchParams.get('language');
    const isActive = searchParams.get('isActive');

    // Build where conditions
    const conditions = [];
    
    if (date) {
      const targetDate = new Date(date);
      conditions.push(eq(dailyChallenges.date, targetDate));
    }
    
    if (language) {
      conditions.push(eq(dailyChallenges.language, language as 'spanish' | 'french' | 'german' | 'italian' | 'portuguese' | 'japanese' | 'chinese' | 'english'));
    }
    
    if (isActive !== null && isActive !== undefined) {
      conditions.push(eq(dailyChallenges.isActive, isActive === 'true'));
    }

    // Get challenges with participant count
    const challengesWithStats = await db
      .select({
        id: dailyChallenges.id,
        date: dailyChallenges.date,
        title: dailyChallenges.title,
        description: dailyChallenges.description,
        targetValue: dailyChallenges.targetValue,
        pointsReward: dailyChallenges.pointsReward,
        language: dailyChallenges.language,
        difficultyLevel: dailyChallenges.difficultyLevel,
        isActive: dailyChallenges.isActive,
        createdAt: dailyChallenges.createdAt,
        participantsCount: sql<number>`
          (SELECT COUNT(*) 
           FROM ${userDailyChallenges} 
           WHERE ${userDailyChallenges.challengeId} = ${dailyChallenges.id})
        `,
        completedCount: sql<number>`
          (SELECT COUNT(*) 
           FROM ${userDailyChallenges} 
           WHERE ${userDailyChallenges.challengeId} = ${dailyChallenges.id} 
           AND ${userDailyChallenges.completed} = true)
        `,
      })
      .from(dailyChallenges)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(dailyChallenges.date);

    return NextResponse.json({
      success: true,
      data: challengesWithStats,
    });
  } catch (error) {
    console.error('Error fetching daily challenges:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, targetValue, pointsReward, language, difficultyLevel, date } = body;

    // Basic validation
    if (!title || !description || !targetValue || !pointsReward || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newChallenge = await db
      .insert(dailyChallenges)
      .values({
        title,
        description,
        targetValue,
        pointsReward,
        language: language || null,
        difficultyLevel: difficultyLevel || null,
        date: new Date(date),
        isActive: true,
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newChallenge[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating daily challenge:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}