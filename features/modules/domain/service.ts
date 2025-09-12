import { db } from '@/drizzle/db';
import { 
  modules, 
  moduleLessons, 
  lessons, 
  userProgress 
} from '@/drizzle/schema';
import { eq, and, desc, asc, sql, count } from 'drizzle-orm';
import type { 
  Module, 
  ModuleWithProgress, 
  ModuleProgress,
  Language,
  DifficultyLevel 
} from '../config/module.types';

export class ModuleService {
  /**
   * Get all modules for a specific language with progress information
   */
  static async getModulesWithProgress(
    language: Language, 
    userId?: string
  ): Promise<ModuleWithProgress[]> {
    try {
      // Get modules ordered by their sequence
      const moduleResults = await db
        .select({
          id: modules.id,
          title: modules.title,
          description: modules.description,
          language: modules.language,
          difficultyLevel: modules.difficultyLevel,
          imageUrl: modules.imageUrl,
          isActive: modules.isActive,
          order: modules.order,
          estimatedDuration: modules.estimatedDuration,
          createdAt: modules.createdAt,
          updatedAt: modules.updatedAt,
        })
        .from(modules)
        .where(
          and(
            eq(modules.language, language),
            eq(modules.isActive, true)
          )
        )
        .orderBy(asc(modules.order));

      const modulesWithProgress: ModuleWithProgress[] = [];

      for (const module of moduleResults) {
        // Get lessons for this module
        const lessonsInModule = await db
          .select({
            id: lessons.id,
            title: lessons.title,
            type: lessons.type,
            order: moduleLessons.order,
          })
          .from(moduleLessons)
          .innerJoin(lessons, eq(moduleLessons.lessonId, lessons.id))
          .where(eq(moduleLessons.moduleId, module.id))
          .orderBy(asc(moduleLessons.order));

        let completedLessons = 0;
        const lessonsWithProgress = [];

        // Check progress for each lesson if user is provided
        for (const lesson of lessonsInModule) {
          let completed = false;
          
          if (userId) {
            const progress = await db
              .select({ completed: userProgress.completed })
              .from(userProgress)
              .where(
                and(
                  eq(userProgress.userId, userId),
                  eq(userProgress.lessonId, lesson.id)
                )
              )
              .limit(1);
            
            completed = progress[0]?.completed ?? false;
            if (completed) completedLessons++;
          }

          lessonsWithProgress.push({
            id: lesson.id,
            title: lesson.title,
            type: lesson.type,
            completed,
            order: lesson.order,
          });
        }

        const totalLessons = lessonsInModule.length;
        const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        
        // Determine if module is unlocked
        let isUnlocked = false;
        if (modulesWithProgress.length === 0) {
          // First module is always unlocked
          isUnlocked = true;
        } else {
          // Module is unlocked if previous module is completed
          const previousModule = modulesWithProgress[modulesWithProgress.length - 1];
          isUnlocked = previousModule.completionPercentage === 100;
        }

        modulesWithProgress.push({
          ...module,
          totalLessons,
          completedLessons,
          isUnlocked,
          completionPercentage,
          lessons: lessonsWithProgress,
        });
      }

      return modulesWithProgress;
    } catch (error) {
      console.error('Error fetching modules with progress:', error);
      throw new Error('Failed to fetch modules with progress');
    }
  }

  /**
   * Get progress for a specific module
   */
  static async getModuleProgress(
    moduleId: string, 
    userId: string
  ): Promise<ModuleProgress> {
    try {
      // Get total lessons in module
      const lessonsInModule = await db
        .select({ lessonId: moduleLessons.lessonId })
        .from(moduleLessons)
        .where(eq(moduleLessons.moduleId, moduleId));

      const totalLessons = lessonsInModule.length;

      if (totalLessons === 0) {
        return {
          moduleId,
          totalLessons: 0,
          completedLessons: 0,
          completionPercentage: 0,
          isCompleted: false,
        };
      }

      // Get completed lessons count
      const completedLessonsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(userProgress)
        .innerJoin(moduleLessons, eq(userProgress.lessonId, moduleLessons.lessonId))
        .where(
          and(
            eq(userProgress.userId, userId),
            eq(moduleLessons.moduleId, moduleId),
            eq(userProgress.completed, true)
          )
        );

      const completedLessons = Number(completedLessonsResult[0]?.count ?? 0);
      const completionPercentage = Math.round((completedLessons / totalLessons) * 100);
      const isCompleted = completionPercentage === 100;

      return {
        moduleId,
        totalLessons,
        completedLessons,
        completionPercentage,
        isCompleted,
      };
    } catch (error) {
      console.error('Error fetching module progress:', error);
      throw new Error('Failed to fetch module progress');
    }
  }

  /**
   * Check if a module is unlocked for a user
   */
  static async isModuleUnlocked(
    moduleId: string, 
    userId: string, 
    language: Language
  ): Promise<boolean> {
    try {
      // Get the order of the target module
      const targetModule = await db
        .select({ order: modules.order })
        .from(modules)
        .where(eq(modules.id, moduleId))
        .limit(1);

      if (!targetModule[0]) {
        return false;
      }

      const targetOrder = targetModule[0].order;

      // If it's the first module (order 0 or 1), it's always unlocked
      if (targetOrder <= 1) {
        return true;
      }

      // Get the previous module (one order less)
      const previousModule = await db
        .select({ id: modules.id })
        .from(modules)
        .where(
          and(
            eq(modules.language, language),
            eq(modules.order, targetOrder - 1),
            eq(modules.isActive, true)
          )
        )
        .limit(1);

      if (!previousModule[0]) {
        return true; // If no previous module, unlock this one
      }

      // Check if previous module is completed
      const previousModuleProgress = await this.getModuleProgress(
        previousModule[0].id, 
        userId
      );

      return previousModuleProgress.isCompleted;
    } catch (error) {
      console.error('Error checking module unlock status:', error);
      return false;
    }
  }
}