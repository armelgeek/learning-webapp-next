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

    // Sample modules
    const sampleModules = [
      {
        title: 'Spanish Basics',
        description: 'Essential Spanish for beginners',
        language: 'spanish' as const,
        difficultyLevel: 'beginner' as const,
        imageUrl: '/images/spanish-basics.jpg',
        estimatedDuration: 180, // 3 hours
        order: 1,
      },
      {
        title: 'French Fundamentals',
        description: 'Start your French learning journey',
        language: 'french' as const,
        difficultyLevel: 'beginner' as const,
        imageUrl: '/images/french-fundamentals.jpg',
        estimatedDuration: 200, // 3.3 hours
        order: 1,
      },
      {
        title: 'German Grammar Essentials',
        description: 'Master the basics of German grammar',
        language: 'german' as const,
        difficultyLevel: 'beginner' as const,
        imageUrl: '/images/german-grammar.jpg',
        estimatedDuration: 240, // 4 hours
        order: 1,
      },
      {
        title: 'Italian Conversation',
        description: 'Learn to speak Italian confidently',
        language: 'italian' as const,
        difficultyLevel: 'intermediate' as const,
        imageUrl: '/images/italian-conversation.jpg',
        estimatedDuration: 300, // 5 hours
        order: 2,
      },
      {
        title: 'Business Spanish',
        description: 'Professional Spanish for the workplace',
        language: 'spanish' as const,
        difficultyLevel: 'advanced' as const,
        imageUrl: '/images/business-spanish.jpg',
        estimatedDuration: 360, // 6 hours
        order: 3,
      },
    ];

    const insertedModules = await db.insert(modules).values(sampleModules).returning();
    console.log(`✅ Inserted ${insertedModules.length} modules`);

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