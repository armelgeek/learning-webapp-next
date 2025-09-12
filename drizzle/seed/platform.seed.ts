import { db } from '../db';
import { achievements, modules, moduleLessons, forumCategories, forumTopics, dailyChallenges } from '../schema';

async function seedPlatformData() {
  console.log('🌱 Seeding platform data...');

  try {
    // Sample achievements
    const sampleAchievements = [
      {
        name: 'First Steps',
        description: 'Complete your first lesson',
        type: 'lessons_completed' as const,
        iconUrl: '/icons/first-lesson.svg',
        pointsRequired: 1,
        criteria: { lessonsCompleted: 1 },
      },
      {
        name: 'Week Warrior',
        description: 'Study for 7 consecutive days',
        type: 'streak' as const,
        iconUrl: '/icons/week-warrior.svg',
        pointsRequired: 7,
        criteria: { streakDays: 7 },
      },
      {
        name: 'Perfect Score',
        description: 'Get 100% on a lesson',
        type: 'perfect_score' as const,
        iconUrl: '/icons/perfect-score.svg',
        pointsRequired: 1,
        criteria: { perfectScores: 1 },
      },
      {
        name: 'Lesson Master',
        description: 'Complete 50 lessons',
        type: 'lessons_completed' as const,
        iconUrl: '/icons/lesson-master.svg',
        pointsRequired: 50,
        criteria: { lessonsCompleted: 50 },
      },
      {
        name: 'Daily Achiever',
        description: 'Reach your daily goal',
        type: 'daily_goal' as const,
        iconUrl: '/icons/daily-goal.svg',
        pointsRequired: 1,
        criteria: { dailyGoalsReached: 1 },
      },
    ];

    const insertedAchievements = await db.insert(achievements).values(sampleAchievements).returning();
    console.log(`✅ Inserted ${insertedAchievements.length} achievements`);

    // Sample modules - organized for progressive unlocking
    const sampleModules = [
      // Spanish progression
      {
        title: 'Spanish Vocabulary Basics',
        description: 'Essential Spanish words and phrases for beginners',
        language: 'spanish' as const,
        difficultyLevel: 'beginner' as const,
        imageUrl: '/images/spanish-vocabulary.jpg',
        estimatedDuration: 120, // 2 hours
        order: 1,
      },
      {
        title: 'Spanish Grammar Fundamentals',
        description: 'Master basic Spanish grammar rules and structures',
        language: 'spanish' as const,
        difficultyLevel: 'beginner' as const,
        imageUrl: '/images/spanish-grammar.jpg',
        estimatedDuration: 180, // 3 hours
        order: 2,
      },
      {
        title: 'Spanish Phrases & Expressions',
        description: 'Learn common Spanish phrases for everyday conversations',
        language: 'spanish' as const,
        difficultyLevel: 'beginner' as const,
        imageUrl: '/images/spanish-phrases.jpg',
        estimatedDuration: 150, // 2.5 hours
        order: 3,
      },
      {
        title: 'Spanish Pronunciation Practice',
        description: 'Perfect your Spanish pronunciation and accent',
        language: 'spanish' as const,
        difficultyLevel: 'intermediate' as const,
        imageUrl: '/images/spanish-pronunciation.jpg',
        estimatedDuration: 120, // 2 hours
        order: 4,
      },
      {
        title: 'Spanish Listening Comprehension',
        description: 'Improve your Spanish listening skills with real conversations',
        language: 'spanish' as const,
        difficultyLevel: 'intermediate' as const,
        imageUrl: '/images/spanish-listening.jpg',
        estimatedDuration: 200, // 3.3 hours
        order: 5,
      },
      // French progression
      {
        title: 'French Vocabulary Essentials',
        description: 'Build your French vocabulary foundation',
        language: 'french' as const,
        difficultyLevel: 'beginner' as const,
        imageUrl: '/images/french-vocabulary.jpg',
        estimatedDuration: 130, // 2.2 hours
        order: 1,
      },
      {
        title: 'French Grammar Basics',
        description: 'Learn the fundamentals of French grammar',
        language: 'french' as const,
        difficultyLevel: 'beginner' as const,
        imageUrl: '/images/french-grammar.jpg',
        estimatedDuration: 200, // 3.3 hours
        order: 2,
      },
      {
        title: 'French Conversation Starters',
        description: 'Practice common French conversation topics',
        language: 'french' as const,
        difficultyLevel: 'intermediate' as const,
        imageUrl: '/images/french-conversation.jpg',
        estimatedDuration: 180, // 3 hours
        order: 3,
      },
      // German progression
      {
        title: 'German Vocabulary Foundation',
        description: 'Essential German words for beginners',
        language: 'german' as const,
        difficultyLevel: 'beginner' as const,
        imageUrl: '/images/german-vocabulary.jpg',
        estimatedDuration: 140, // 2.3 hours
        order: 1,
      },
      {
        title: 'German Grammar Structure',
        description: 'Understanding German grammar and sentence structure',
        language: 'german' as const,
        difficultyLevel: 'beginner' as const,
        imageUrl: '/images/german-grammar.jpg',
        estimatedDuration: 240, // 4 hours
        order: 2,
      },
    ];

    const insertedModules = await db.insert(modules).values(sampleModules).returning();
    console.log(`✅ Inserted ${insertedModules.length} modules`);

    // We'll need to create module-lesson relationships after lessons are created
    // This will be done in the lessons seed or we can fetch existing lessons
    console.log(`ℹ️  Module-lesson relationships will be created when lessons are available`);

    // Sample forum categories
    const sampleForumCategories = [
      {
        name: 'General Discussion',
        description: 'General language learning topics',
        color: '#3B82F6',
        order: 1,
      },
      {
        name: 'Spanish Learners',
        description: 'Discussion for Spanish language learners',
        language: 'spanish' as const,
        color: '#EF4444',
        order: 2,
      },
      {
        name: 'French Learners',
        description: 'Discussion for French language learners',
        language: 'french' as const,
        color: '#8B5CF6',
        order: 3,
      },
      {
        name: 'Grammar Help',
        description: 'Get help with grammar questions',
        color: '#10B981',
        order: 4,
      },
      {
        name: 'Study Tips',
        description: 'Share and discover study strategies',
        color: '#F59E0B',
        order: 5,
      },
    ];

    const insertedCategories = await db.insert(forumCategories).values(sampleForumCategories).returning();
    console.log(`✅ Inserted ${insertedCategories.length} forum categories`);

    // Sample forum topics (we'll need user IDs, so we'll create them later)
    const sampleTopics = [
      {
        categoryId: insertedCategories[0].id,
        userId: 'sample-user-1', // This would be a real user ID in production
        title: 'Welcome to LinguaLearn!',
        content: 'Welcome to our language learning community! Feel free to introduce yourself and share your learning goals.',
        viewCount: 150,
        replyCount: 23,
      },
      {
        categoryId: insertedCategories[1].id,
        userId: 'sample-user-2',
        title: 'Tips for rolling your Rs in Spanish',
        content: 'I\'m struggling with the rolled R sound in Spanish. Does anyone have any tips or exercises that helped them?',
        viewCount: 89,
        replyCount: 12,
      },
      {
        categoryId: insertedCategories[2].id,
        userId: 'sample-user-3',
        title: 'French pronunciation guide',
        content: 'I\'ve created a comprehensive guide for French pronunciation. Here are the key points...',
        viewCount: 67,
        replyCount: 8,
      },
      {
        categoryId: insertedCategories[3].id,
        userId: 'sample-user-4',
        title: 'Subjunctive mood - when to use it?',
        content: 'Can someone explain when to use the subjunctive mood in Romance languages? I keep getting confused.',
        viewCount: 134,
        replyCount: 19,
      },
    ];

    // We'll skip inserting forum topics for now since we don't have real user IDs
    console.log(`ℹ️  Skipping forum topics (requires real user IDs)`);

    // Sample daily challenges
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sampleChallenges = [
      {
        date: yesterday,
        title: 'Yesterday\'s Challenge',
        description: 'Complete 3 vocabulary lessons',
        targetValue: 3,
        pointsReward: 15,
        language: 'spanish' as const,
        difficultyLevel: 'beginner' as const,
      },
      {
        date: today,
        title: 'Today\'s Challenge',
        description: 'Study for 20 minutes',
        targetValue: 20,
        pointsReward: 20,
        difficultyLevel: 'beginner' as const,
      },
      {
        date: tomorrow,
        title: 'Tomorrow\'s Challenge',
        description: 'Complete 1 grammar lesson',
        targetValue: 1,
        pointsReward: 10,
        language: 'french' as const,
        difficultyLevel: 'intermediate' as const,
      },
    ];

    const insertedChallenges = await db.insert(dailyChallenges).values(sampleChallenges).returning();
    console.log(`✅ Inserted ${insertedChallenges.length} daily challenges`);

    console.log('🎉 Platform data seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding platform data:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedPlatformData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedPlatformData };