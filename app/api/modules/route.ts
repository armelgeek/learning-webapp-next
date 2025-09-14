import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getModulesWithProgressUseCase } from '@/features/modules/domain/use-cases/get-modules-with-progress.use-case';
import { createModuleUseCase } from '@/features/modules/domain/use-cases/create-module.use-case';
import type { Language } from '@/features/modules/config/module.types';
import { createModuleSchema } from '@/features/modules/config/module.schema';

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
    
    // Validate request body
    const validationResult = createModuleSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid module data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const result = await createModuleUseCase(validationResult.data);
    
    if (!result.success) {
      console.error('Error creating module:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('POST /api/modules error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}