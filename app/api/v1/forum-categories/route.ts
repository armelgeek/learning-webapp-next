import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { forumCategories } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');

    const conditions = [eq(forumCategories.isActive, true)];
    
    if (language) {
      conditions.push(eq(forumCategories.language, language as 'spanish' | 'french' | 'german' | 'italian' | 'portuguese' | 'japanese' | 'chinese' | 'english'));
    }

    const categories = await db
      .select()
      .from(forumCategories)
      .where(and(...conditions))
      .orderBy(forumCategories.order, forumCategories.name);

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching forum categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}