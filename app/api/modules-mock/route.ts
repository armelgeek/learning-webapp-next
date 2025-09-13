import { NextRequest, NextResponse } from 'next/server';
import type { ModuleWithProgress } from '@/features/modules/config/module.types';

// Mock data for demonstration
const mockEnglishModules: ModuleWithProgress[] = [
  {
    id: 'eng-module-1',
    title: 'Alphabet & Pronunciation',
    description: 'Learn the English alphabet, basic sounds, and pronunciation fundamentals',
    language: 'english',
    difficultyLevel: 'beginner',
    imageUrl: null,
    isActive: true,
    order: 1,
    estimatedDuration: 30,
    prerequisites: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    totalLessons: 5,
    completedLessons: 0,
    status: 'unlocked', // First module is always unlocked
    isUnlocked: true,
    completionPercentage: 0,
    lessons: [
      { id: 'lesson-1', title: 'Letter A-H', type: 'pronunciation', completed: false, order: 1 },
      { id: 'lesson-2', title: 'Letter I-P', type: 'pronunciation', completed: false, order: 2 },
      { id: 'lesson-3', title: 'Letter Q-Z', type: 'pronunciation', completed: false, order: 3 },
      { id: 'lesson-4', title: 'Basic Sounds', type: 'listening', completed: false, order: 4 },
      { id: 'lesson-5', title: 'Pronunciation Practice', type: 'pronunciation', completed: false, order: 5 },
    ],
  },
  {
    id: 'eng-module-2',
    title: 'Basic Grammar',
    description: 'Master fundamental grammar rules, including nouns, verbs, and simple sentence structure',
    language: 'english',
    difficultyLevel: 'beginner',
    imageUrl: null,
    isActive: true,
    order: 2,
    estimatedDuration: 45,
    prerequisites: ['eng-module-1'],
    createdAt: new Date(),
    updatedAt: new Date(),
    totalLessons: 6,
    completedLessons: 0,
    status: 'locked', // Locked until first module is completed
    isUnlocked: false,
    completionPercentage: 0,
    lessons: [
      { id: 'lesson-6', title: 'Nouns', type: 'grammar', completed: false, order: 1 },
      { id: 'lesson-7', title: 'Verbs', type: 'grammar', completed: false, order: 2 },
      { id: 'lesson-8', title: 'Adjectives', type: 'grammar', completed: false, order: 3 },
      { id: 'lesson-9', title: 'Articles', type: 'grammar', completed: false, order: 4 },
      { id: 'lesson-10', title: 'Simple Present', type: 'grammar', completed: false, order: 5 },
      { id: 'lesson-11', title: 'Grammar Practice', type: 'grammar', completed: false, order: 6 },
    ],
  },
  {
    id: 'eng-module-3',
    title: 'Sentence Construction',
    description: 'Learn to build complex sentences using proper grammar and word order',
    language: 'english',
    difficultyLevel: 'beginner',
    imageUrl: null,
    isActive: true,
    order: 3,
    estimatedDuration: 40,
    prerequisites: ['eng-module-2'],
    createdAt: new Date(),
    updatedAt: new Date(),
    totalLessons: 4,
    completedLessons: 0,
    status: 'locked',
    isUnlocked: false,
    completionPercentage: 0,
    lessons: [
      { id: 'lesson-12', title: 'Word Order', type: 'grammar', completed: false, order: 1 },
      { id: 'lesson-13', title: 'Questions', type: 'grammar', completed: false, order: 2 },
      { id: 'lesson-14', title: 'Negative Sentences', type: 'grammar', completed: false, order: 3 },
      { id: 'lesson-15', title: 'Complex Sentences', type: 'grammar', completed: false, order: 4 },
    ],
  },
  {
    id: 'eng-module-4',
    title: 'Simple Conversations',
    description: 'Practice basic conversational skills and common expressions',
    language: 'english',
    difficultyLevel: 'intermediate',
    imageUrl: null,
    isActive: true,
    order: 4,
    estimatedDuration: 50,
    prerequisites: ['eng-module-3'],
    createdAt: new Date(),
    updatedAt: new Date(),
    totalLessons: 5,
    completedLessons: 0,
    status: 'locked',
    isUnlocked: false,
    completionPercentage: 0,
    lessons: [
      { id: 'lesson-16', title: 'Greetings', type: 'phrases', completed: false, order: 1 },
      { id: 'lesson-17', title: 'Introductions', type: 'phrases', completed: false, order: 2 },
      { id: 'lesson-18', title: 'Daily Activities', type: 'vocabulary', completed: false, order: 3 },
      { id: 'lesson-19', title: 'Small Talk', type: 'phrases', completed: false, order: 4 },
      { id: 'lesson-20', title: 'Conversation Practice', type: 'listening', completed: false, order: 5 },
    ],
  },
  {
    id: 'eng-module-5',
    title: 'Vocabulary Building',
    description: 'Expand your vocabulary with common words and phrases',
    language: 'english',
    difficultyLevel: 'intermediate',
    imageUrl: null,
    isActive: true,
    order: 5,
    estimatedDuration: 35,
    prerequisites: ['eng-module-2'], // Can start after basic grammar
    createdAt: new Date(),
    updatedAt: new Date(),
    totalLessons: 4,
    completedLessons: 0,
    status: 'locked',
    isUnlocked: false,
    completionPercentage: 0,
    lessons: [
      { id: 'lesson-21', title: 'Common Words', type: 'vocabulary', completed: false, order: 1 },
      { id: 'lesson-22', title: 'Family & Friends', type: 'vocabulary', completed: false, order: 2 },
      { id: 'lesson-23', title: 'Food & Drinks', type: 'vocabulary', completed: false, order: 3 },
      { id: 'lesson-24', title: 'Travel & Places', type: 'vocabulary', completed: false, order: 4 },
    ],
  },
  {
    id: 'eng-module-6',
    title: 'Advanced Conversations',
    description: 'Engage in complex discussions and express opinions fluently',
    language: 'english',
    difficultyLevel: 'advanced',
    imageUrl: null,
    isActive: true,
    order: 6,
    estimatedDuration: 60,
    prerequisites: ['eng-module-4', 'eng-module-5'], // Requires both conversation and vocabulary
    createdAt: new Date(),
    updatedAt: new Date(),
    totalLessons: 6,
    completedLessons: 0,
    status: 'locked',
    isUnlocked: false,
    completionPercentage: 0,
    lessons: [
      { id: 'lesson-25', title: 'Expressing Opinions', type: 'phrases', completed: false, order: 1 },
      { id: 'lesson-26', title: 'Debates & Discussions', type: 'phrases', completed: false, order: 2 },
      { id: 'lesson-27', title: 'Professional English', type: 'vocabulary', completed: false, order: 3 },
      { id: 'lesson-28', title: 'Cultural Topics', type: 'vocabulary', completed: false, order: 4 },
      { id: 'lesson-29', title: 'Advanced Listening', type: 'listening', completed: false, order: 5 },
      { id: 'lesson-30', title: 'Fluency Practice', type: 'phrases', completed: false, order: 6 },
    ],
  },
];

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

    // For demo purposes, only return English modules
    if (language === 'english') {
      return NextResponse.json(mockEnglishModules);
    }

    // Return empty array for other languages
    return NextResponse.json([]);
  } catch (error) {
    console.error('GET /api/modules error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}