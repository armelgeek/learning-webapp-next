import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { DashboardService } from '@/features/progress/domain/dashboard.service';
import type { LanguageKey } from '@/features/language/config/language.schema';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const targetLanguage = searchParams.get('targetLanguage');

    if (!targetLanguage) {
      return NextResponse.json(
        { error: 'targetLanguage parameter is required' },
        { status: 400 }
      );
    }

    const result = await DashboardService.getRecommendedModules(
      session.user.id,
      targetLanguage as LanguageKey
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching recommended modules:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}