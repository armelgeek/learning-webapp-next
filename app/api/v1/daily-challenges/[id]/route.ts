import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/drizzle/db';
import { dailyChallenges } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Check if challenge exists
    const existingChallenge = await db
      .select()
      .from(dailyChallenges)
      .where(eq(dailyChallenges.id, id))
      .limit(1);

    if (!existingChallenge[0]) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    // Delete the challenge
    await db
      .delete(dailyChallenges)
      .where(eq(dailyChallenges.id, id));

    return NextResponse.json({
      success: true,
      data: { message: 'Challenge deleted successfully', id },
    });
  } catch (error) {
    console.error('Error deleting daily challenge:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}