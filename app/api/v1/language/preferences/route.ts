import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { LanguageService } from '@/features/language/domain/service';
import { languageSelectSchema } from '@/features/language/config/language.schema';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await LanguageService.getUserLanguagePreferences(session.user.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching language preferences:', error);
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
    const validatedData = languageSelectSchema.parse(body);

    const result = await LanguageService.updateUserLanguagePreferences(
      session.user.id,
      validatedData
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating language preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}