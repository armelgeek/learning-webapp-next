import { db } from '@/drizzle/db';
import { achievements } from '@/drizzle/schema';
import { and, eq, desc, sql } from 'drizzle-orm';

export interface CreateAchievementPayload {
  name: string;
  description: string;
  type: string;
  iconUrl?: string;
  pointsRequired?: number;
  criteria?: any;
  isActive?: boolean;
}

export interface UpdateAchievementPayload {
  name?: string;
  description?: string;
  type?: string;
  iconUrl?: string;
  pointsRequired?: number;
  criteria?: any;
  isActive?: boolean;
}

export interface AchievementFilter {
  type?: string;
  isActive?: boolean;
}

export class AchievementsService {
  static async getAchievements(filter?: AchievementFilter) {
    const conditions = [];
    
    if (filter?.type) {
      conditions.push(eq(achievements.type, filter.type as any));
    }
    if (filter?.isActive !== undefined) {
      conditions.push(eq(achievements.isActive, filter.isActive));
    }

    const result = await db
      .select({
        id: achievements.id,
        name: achievements.name,
        description: achievements.description,
        type: achievements.type,
        iconUrl: achievements.iconUrl,
        pointsRequired: achievements.pointsRequired,
        criteria: achievements.criteria,
        isActive: achievements.isActive,
        createdAt: achievements.createdAt,
        // Mock earned count for now
        earnedCount: sql<number>`FLOOR(RANDOM() * 200 + 1)`,
      })
      .from(achievements)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(achievements.createdAt);

    // Convert Date objects to ISO strings for JSON serialization
    return result.map(achievement => ({
      ...achievement,
      earnedCount: Number(achievement.earnedCount),
      createdAt: achievement.createdAt?.toISOString() || null,
    }));
  }

  static async getAchievementById(id: string) {
    const result = await db
      .select()
      .from(achievements)
      .where(eq(achievements.id, id))
      .limit(1);
    
    return result[0] || null;
  }

  static async createAchievement(data: CreateAchievementPayload) {
    const result = await db
      .insert(achievements)
      .values({
        ...data,
        type: data.type as any,
        createdAt: new Date(),
      })
      .returning();

    return result[0];
  }

  static async updateAchievement(id: string, data: Partial<UpdateAchievementPayload>) {
    const result = await db
      .update(achievements)
      .set({
        ...data,
        type: data.type as any,
      })
      .where(eq(achievements.id, id))
      .returning();

    return result[0] || null;
  }

  static async deleteAchievement(id: string) {
    const result = await db
      .delete(achievements)
      .where(eq(achievements.id, id))
      .returning();

    return result[0] || null;
  }
}