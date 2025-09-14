import { db } from '@/drizzle/db';
import {
  modules,
  moduleLessons,
  lessons,
  userProgress,
  userModuleProgress
} from '@/drizzle/schema';
import { eq, and, asc, sql, inArray } from 'drizzle-orm';
import type {
  ModuleWithProgress,
  ModuleProgress,
  Language,
  DifficultyLevel,
  ModuleStatus,
  CreateModulePayload,
  UpdateModulePayload,
  ModuleFilter
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
          prerequisites: modules.prerequisites,
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

      for (const mod of moduleResults) {
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
          .where(eq(moduleLessons.moduleId, mod.id))
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

        // Get module status for user
        let status: ModuleStatus = 'locked';
        let isUnlocked = false;

        if (userId) {
          const moduleProgress = await db
            .select({ status: userModuleProgress.status })
            .from(userModuleProgress)
            .where(
              and(
                eq(userModuleProgress.userId, userId),
                eq(userModuleProgress.moduleId, mod.id)
              )
            )
            .limit(1);

          status = moduleProgress[0]?.status ?? 'locked';

          // If no explicit status, determine based on prerequisites
          if (!moduleProgress[0]) {
            const prerequisitesMet = await this.checkPrerequisites(mod.id, userId);
            if (prerequisitesMet) {
              status = 'unlocked';
              // Auto-unlock the module
              await this.unlockModule(mod.id, userId);
            }
          }

          isUnlocked = status === 'unlocked' || status === 'completed';

          // Update status to completed if all lessons are done
          if (status === 'unlocked' && completionPercentage === 100) {
            status = 'completed';
            await this.completeModule(mod.id, userId);
          }
        } else {
          // For guest users, use sequential unlocking
          if (modulesWithProgress.length === 0) {
            // First module is always unlocked
            status = 'unlocked';
            isUnlocked = true;
          }
        }

        modulesWithProgress.push({
          ...mod,
          prerequisites: mod.prerequisites as string[] ?? [],
          totalLessons,
          completedLessons,
          status,
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
      // Get module details
      const modResult = await db
        .select({
          id: modules.id,
          prerequisites: modules.prerequisites,
        })
        .from(modules)
        .where(eq(modules.id, moduleId))
        .limit(1);

      if (!modResult[0]) {
        throw new Error('Module not found');
      }

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
          status: 'locked',
          isCompleted: false,
          prerequisites: modResult[0].prerequisites as string[] ?? [],
          prerequisitesMet: false,
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

      // Get module status
      const moduleStatusResult = await db
        .select({ status: userModuleProgress.status })
        .from(userModuleProgress)
        .where(
          and(
            eq(userModuleProgress.userId, userId),
            eq(userModuleProgress.moduleId, moduleId)
          )
        )
        .limit(1);

      let status: ModuleStatus = moduleStatusResult[0]?.status ?? 'locked';

      // Check if prerequisites are met
      const prerequisitesMet = await this.checkPrerequisites(moduleId, userId);

      // Auto-update status if needed
      if (status === 'locked' && prerequisitesMet) {
        status = 'unlocked';
        await this.unlockModule(moduleId, userId);
      } else if (status === 'unlocked' && isCompleted) {
        status = 'completed';
        await this.completeModule(moduleId, userId);
      }

      return {
        moduleId,
        totalLessons,
        completedLessons,
        completionPercentage,
        status,
        isCompleted,
        prerequisites: modResult[0].prerequisites as string[] ?? [],
        prerequisitesMet,
      };
    } catch (error) {
      console.error('Error fetching module progress:', error);
      throw new Error('Failed to fetch module progress');
    }
  }

  /**
   * Check if a module's prerequisites are met
   */
  static async checkPrerequisites(
    moduleId: string,
    userId: string
  ): Promise<boolean> {
    try {
      // Get module prerequisites
      const modResult = await db
        .select({ prerequisites: modules.prerequisites })
        .from(modules)
        .where(eq(modules.id, moduleId))
        .limit(1);

      if (!modResult[0] || !modResult[0].prerequisites) {
        return true; // No prerequisites means always unlocked
      }

      const prerequisites = modResult[0].prerequisites as string[];

      if (prerequisites.length === 0) {
        return true; // Empty prerequisites array means always unlocked
      }

      // Check if all prerequisite modules are completed
      const completedPrerequisites = await db
        .select({ moduleId: userModuleProgress.moduleId })
        .from(userModuleProgress)
        .where(
          and(
            eq(userModuleProgress.userId, userId),
            inArray(userModuleProgress.moduleId, prerequisites),
            eq(userModuleProgress.status, 'completed')
          )
        );

      return completedPrerequisites.length === prerequisites.length;
    } catch (error) {
      console.error('Error checking prerequisites:', error);
      return false;
    }
  }

  /**
   * Unlock a module for a user - Version corrigée avec vérification d'existence
   */
  static async unlockModule(moduleId: string, userId: string): Promise<void> {
    try {
      // Vérifier si l'enregistrement existe déjà
      const existingProgress = await db
        .select({
          id: userModuleProgress.id,
          status: userModuleProgress.status
        })
        .from(userModuleProgress)
        .where(
          and(
            eq(userModuleProgress.userId, userId),
            eq(userModuleProgress.moduleId, moduleId)
          )
        )
        .limit(1);

      if (existingProgress.length > 0) {
        // Mettre à jour l'enregistrement existant seulement s'il est verrouillé
        if (existingProgress[0].status === 'locked') {
          await db
            .update(userModuleProgress)
            .set({
              status: 'unlocked',
              unlockedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(userModuleProgress.userId, userId),
                eq(userModuleProgress.moduleId, moduleId)
              )
            );
        }
      } else {
        // Créer un nouvel enregistrement
        await db
          .insert(userModuleProgress)
          .values({
            userId,
            moduleId,
            status: 'unlocked',
            unlockedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
      }
    } catch (error) {
      console.error('Error unlocking module:', error);
      throw new Error('Failed to unlock module');
    }
  }

  /**
   * Mark a module as completed for a user - Version corrigée avec vérification d'existence
   */
  static async completeModule(moduleId: string, userId: string): Promise<void> {
    try {
      // Vérifier si l'enregistrement existe déjà
      const existingProgress = await db
        .select({
          id: userModuleProgress.id,
          status: userModuleProgress.status
        })
        .from(userModuleProgress)
        .where(
          and(
            eq(userModuleProgress.userId, userId),
            eq(userModuleProgress.moduleId, moduleId)
          )
        )
        .limit(1);

      if (existingProgress.length > 0) {
        // Mettre à jour l'enregistrement existant
        await db
          .update(userModuleProgress)
          .set({
            status: 'completed',
            completedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(userModuleProgress.userId, userId),
              eq(userModuleProgress.moduleId, moduleId)
            )
          );
      } else {
        // Créer un nouvel enregistrement directement en tant que completed
        await db
          .insert(userModuleProgress)
          .values({
            userId,
            moduleId,
            status: 'completed',
            unlockedAt: new Date(),
            completedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
      }

      // Check and unlock dependent modules
      await this.unlockDependentModules(moduleId, userId);
    } catch (error) {
      console.error('Error completing module:', error);
      throw new Error('Failed to complete module');
    }
  }

  /**
   * Unlock modules that depend on the completed module
   */
  static async unlockDependentModules(completedModuleId: string, userId: string): Promise<void> {
    try {
      // Find modules that have the completed module as a prerequisite
      const dependentModules = await db
        .select({ id: modules.id, prerequisites: modules.prerequisites })
        .from(modules)
        .where(eq(modules.isActive, true));

      for (const mod of dependentModules) {
        const prerequisites = mod.prerequisites as string[] ?? [];

        if (prerequisites.includes(completedModuleId)) {
          // Check if all prerequisites are now met
          const prerequisitesMet = await this.checkPrerequisites(mod.id, userId);

          if (prerequisitesMet) {
            // Check if module is still locked
            const currentStatus = await db
              .select({ status: userModuleProgress.status })
              .from(userModuleProgress)
              .where(
                and(
                  eq(userModuleProgress.userId, userId),
                  eq(userModuleProgress.moduleId, mod.id)
                )
              )
              .limit(1);

            if (!currentStatus[0] || currentStatus[0].status === 'locked') {
              await this.unlockModule(mod.id, userId);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error unlocking dependent modules:', error);
    }
  }

  // Admin-specific methods
  static async getModulesForAdmin(filter?: ModuleFilter) {
    const conditions = [];

    if (filter?.language) {
      conditions.push(eq(modules.language, filter.language as Language));
    }
    if (filter?.difficultyLevel) {
      conditions.push(eq(modules.difficultyLevel, filter.difficultyLevel as DifficultyLevel));
    }
    if (filter?.isActive !== undefined) {
      conditions.push(eq(modules.isActive, filter.isActive));
    }

    const result = await db
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
        prerequisites: modules.prerequisites,
        createdAt: modules.createdAt,
        updatedAt: modules.updatedAt,
        // Count lessons in this module
        lessonsCount: sql<number>`
          (SELECT COUNT(*) 
           FROM ${moduleLessons} ml 
           WHERE ml.module_id = ${modules.id})
        `,
      })
      .from(modules)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(modules.order, modules.createdAt);

    // Convert Date objects to ISO strings for JSON serialization
    return result.map(module => ({
      ...module,
      lessonsCount: Number(module.lessonsCount),
      createdAt: module.createdAt?.toISOString() || null,
      updatedAt: module.updatedAt?.toISOString() || null,
    }));
  }

  static async createModule(data: CreateModulePayload) {
    const result = await db
      .insert(modules)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return result[0];
  }

  static async updateModule(id: string, data: Partial<UpdateModulePayload>) {
    const result = await db
      .update(modules)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(modules.id, id))
      .returning();

    return result[0] || null;
  }

  static async deleteModule(id: string) {
    const result = await db
      .delete(modules)
      .where(eq(modules.id, id))
      .returning();

    return result[0] || null;
  }
}