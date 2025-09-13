import { db } from '../db';
import { modules } from '../schema';

interface ModuleData {
  id: string;
  title: string;
  description: string;
  language: 'english' | 'spanish' | 'french' | 'german' | 'italian' | 'portuguese' | 'japanese' | 'chinese';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  order: number;
  estimatedDuration?: number;
  prerequisites?: string[];
}

const englishModules: ModuleData[] = [
  {
    id: 'eng-module-1',
    title: 'Alphabet & Pronunciation',
    description: 'Learn the English alphabet, basic sounds, and pronunciation fundamentals',
    language: 'english',
    difficultyLevel: 'beginner',
    order: 1,
    estimatedDuration: 30,
    prerequisites: [],
  },
  {
    id: 'eng-module-2',
    title: 'Basic Grammar',
    description: 'Master fundamental grammar rules, including nouns, verbs, and simple sentence structure',
    language: 'english',
    difficultyLevel: 'beginner',
    order: 2,
    estimatedDuration: 45,
    prerequisites: ['eng-module-1'],
  },
  {
    id: 'eng-module-3',
    title: 'Sentence Construction',
    description: 'Learn to build complex sentences using proper grammar and word order',
    language: 'english',
    difficultyLevel: 'beginner',
    order: 3,
    estimatedDuration: 40,
    prerequisites: ['eng-module-2'],
  },
  {
    id: 'eng-module-4',
    title: 'Simple Conversations',
    description: 'Practice basic conversational skills and common expressions',
    language: 'english',
    difficultyLevel: 'intermediate',
    order: 4,
    estimatedDuration: 50,
    prerequisites: ['eng-module-3'],
  },
  {
    id: 'eng-module-5',
    title: 'Vocabulary Building',
    description: 'Expand your vocabulary with common words and phrases',
    language: 'english',
    difficultyLevel: 'intermediate',
    order: 5,
    estimatedDuration: 35,
    prerequisites: ['eng-module-2'], // Can start after basic grammar
  },
  {
    id: 'eng-module-6',
    title: 'Advanced Conversations',
    description: 'Engage in complex discussions and express opinions fluently',
    language: 'english',
    difficultyLevel: 'advanced',
    order: 6,
    estimatedDuration: 60,
    prerequisites: ['eng-module-4', 'eng-module-5'], // Requires both conversation and vocabulary
  },
];

const spanishModules: ModuleData[] = [
  {
    id: 'spa-module-1',
    title: 'Spanish Alphabet & Sounds',
    description: 'Learn the Spanish alphabet and pronunciation rules',
    language: 'spanish',
    difficultyLevel: 'beginner',
    order: 1,
    estimatedDuration: 25,
    prerequisites: [],
  },
  {
    id: 'spa-module-2',
    title: 'Basic Spanish Grammar',
    description: 'Master gender, articles, and basic verb conjugations',
    language: 'spanish',
    difficultyLevel: 'beginner',
    order: 2,
    estimatedDuration: 50,
    prerequisites: ['spa-module-1'],
  },
  {
    id: 'spa-module-3',
    title: 'Common Phrases',
    description: 'Learn essential Spanish phrases for daily conversations',
    language: 'spanish',
    difficultyLevel: 'beginner',
    order: 3,
    estimatedDuration: 40,
    prerequisites: ['spa-module-2'],
  },
];

export async function seedModules() {
  console.log('🌱 Seeding modules...');
  
  try {
    const allModules = [...englishModules, ...spanishModules];
    
    // Insert modules
    for (const moduleData of allModules) {
      await db.insert(modules).values({
        id: moduleData.id,
        title: moduleData.title,
        description: moduleData.description,
        language: moduleData.language,
        difficultyLevel: moduleData.difficultyLevel,
        order: moduleData.order,
        estimatedDuration: moduleData.estimatedDuration,
        prerequisites: moduleData.prerequisites || [],
        isActive: true,
      }).onConflictDoNothing();
    }
    
    console.log(`✅ Seeded ${allModules.length} modules successfully!`);
  } catch (error) {
    console.error('❌ Error seeding modules:', error);
    throw error;
  }
}