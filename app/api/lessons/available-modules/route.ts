import { NextResponse } from 'next/server';
import { getAvailableModulesUseCase } from '@/features/lessons/domain/use-cases/get-available-modules.use-case';

export async function GET() {
  try {
    const result = await getAvailableModulesUseCase();
    
    if (!result.success) {
      console.error('Error fetching available modules:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('GET /api/lessons/available-modules error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}