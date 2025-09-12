import { db } from '@/drizzle/db';
import { 
  userStats, 
  userProgress, 
  dailyChallenges, 
  userDailyChallenges,
  lessons,
  modules,
  moduleLessons,
  forumTopics,
  users
} from '@/drizzle/schema';
import { eq, desc, and, sql, count, gte, lt } from 'drizzle-orm';
import type { LanguageKey } from '@/features/language/config/language.schema';

export class DashboardService {
  static async getUserDashboardData(userId: string, targetLanguage: LanguageKey) {
    try {
      // Get user basic info
      const user = await db
        .select({
          name: users.name,
          email: users.email,
          nativeLanguage: users.nativeLanguage,
          targetLanguages: users.targetLanguages,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user[0]) {
        throw new Error('User not found');
      }

      // Get user stats
      const stats = await db
        .select()
        .from(userStats)
        .where(eq(userStats.userId, userId))
        .limit(1);

      // Get current progress for target language
      const progressQuery = await db
        .select({
          lessonId: userProgress.lessonId,
          completed: userProgress.completed,
          score: userProgress.score,
          lessonTitle: lessons.title,
          lessonType: lessons.type,
        })
        .from(userProgress)
        .leftJoin(lessons, eq(userProgress.lessonId, lessons.id))
        .where(
          and(
            eq(userProgress.userId, userId),
            eq(lessons.language, targetLanguage)
          )
        )
        .orderBy(desc(userProgress.updatedAt))
        .limit(10);

      // Get modules in progress
      const modulesInProgress = await db
        .select({
          moduleId: modules.id,
          moduleTitle: modules.title,
          moduleDescription: modules.description,
          totalLessons: count(moduleLessons.lessonId),
          completedLessons: sql<number>`
            COUNT(CASE WHEN ${userProgress.completed} = true THEN 1 END)
          `.as('completedLessons'),
        })
        .from(modules)
        .leftJoin(moduleLessons, eq(modules.id, moduleLessons.moduleId))
        .leftJoin(lessons, eq(moduleLessons.lessonId, lessons.id))
        .leftJoin(userProgress, and(
          eq(userProgress.lessonId, lessons.id),
          eq(userProgress.userId, userId)
        ))
        .where(eq(modules.language, targetLanguage))
        .groupBy(modules.id, modules.title, modules.description)
        .having(sql`COUNT(CASE WHEN ${userProgress.completed} = true THEN 1 END) < COUNT(${moduleLessons.lessonId})`)
        .limit(5);

      // Get daily challenge - FIX: Création des dates pour la comparaison
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const todayChallenge = await db
        .select({
          challengeId: dailyChallenges.id,
          title: dailyChallenges.title,
          description: dailyChallenges.description,
          targetValue: dailyChallenges.targetValue,
          pointsReward: dailyChallenges.pointsReward,
          currentProgress: userDailyChallenges.currentProgress,
          completed: userDailyChallenges.completed,
        })
        .from(dailyChallenges)
        .leftJoin(userDailyChallenges, and(
          eq(userDailyChallenges.challengeId, dailyChallenges.id),
          eq(userDailyChallenges.userId, userId)
        ))
        .where(
          and(
            gte(dailyChallenges.date, startOfDay),
            lt(dailyChallenges.date, endOfDay),
            eq(dailyChallenges.language, targetLanguage),
            eq(dailyChallenges.isActive, true)
          )
        )
        .limit(1);

      // Get recent forum topics
      const recentForumTopics = await db
        .select({
          id: forumTopics.id,
          title: forumTopics.title,
          content: forumTopics.content,
          createdAt: forumTopics.createdAt,
          replyCount: forumTopics.replyCount,
          viewCount: forumTopics.viewCount,
        })
        .from(forumTopics)
        .orderBy(desc(forumTopics.createdAt))
        .limit(5);

      // Convert Date objects to ISO strings for JSON serialization
      const serializedForumTopics = recentForumTopics.map(topic => ({
        ...topic,
        createdAt: topic.createdAt?.toISOString() || null,
      }));

      // Calculate completion percentage
      const completedLessons = progressQuery.filter(p => p.completed).length;
      const totalLessonsForLanguage = await db
        .select({ count: count() })
        .from(lessons)
        .where(eq(lessons.language, targetLanguage));

      const completionPercentage = totalLessonsForLanguage[0]?.count > 0 
        ? Math.round((completedLessons / totalLessonsForLanguage[0].count) * 100)
        : 0;

      return {
        success: true,
        data: {
          user: user[0],
          stats: stats[0] || {
            streakDays: 0,
            totalLessonsCompleted: 0,
            totalPoints: 0,
            level: 1,
            experience: 0,
            experienceToNextLevel: 100,
          },
          recentProgress: progressQuery,
          modulesInProgress,
          dailyChallenge: todayChallenge[0] || null,
          recentForumTopics: serializedForumTopics,
          completionPercentage,
          targetLanguage,
        },
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return {
        success: false,
        error: 'Failed to fetch dashboard data',
      };
    }
  }

  static async getRecommendedModules(userId: string, targetLanguage: LanguageKey) {
    try {
      // Get user's current level and completed lessons
      const userInfo = await db
        .select({
          currentLevel: users.currentLevel,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      const currentLevel = userInfo[0]?.currentLevel || 'beginner';

      // Get modules that match user's level and haven't been completed
      const recommendedModules = await db
        .select({
          id: modules.id,
          title: modules.title,
          description: modules.description,
          difficultyLevel: modules.difficultyLevel,
          estimatedDuration: modules.estimatedDuration,
          imageUrl: modules.imageUrl,
        })
        .from(modules)
        .where(
          and(
            eq(modules.language, targetLanguage),
            eq(modules.difficultyLevel, currentLevel),
            eq(modules.isActive, true)
          )
        )
        .orderBy(modules.order)
        .limit(3);

      return {
        success: true,
        modules: recommendedModules,
      };
    } catch (error) {
      console.error('Error fetching recommended modules:', error);
      return {
        success: false,
        error: 'Failed to fetch recommended modules',
      };
    }
  }
}