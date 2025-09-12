import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getModulesWithProgressUseCase } from '@/features/modules/domain/use-cases/get-modules-with-progress.use-case';
import type { Language } from '@/features/modules/config/module.types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');

    if (!language) {
      return NextResponse.json(
        { error: 'Language parameter is required' },
        { status: 400 }
      );
    }

    // Get user session for progress tracking
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const userId = session?.user?.id;

    // Get modules with progress
    const result = await getModulesWithProgressUseCase(
      language as Language,
      userId
    );

    if (!result.success) {
      console.error('Error fetching modules:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('GET /api/modules error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}