import { db } from '@/drizzle/db';
import { forumCategories } from '@/drizzle/schema';
import { and, eq, desc, sql } from 'drizzle-orm';

export interface CreateForumCategoryPayload {
  name: string;
  description?: string;
  language?: string;
  color?: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateForumCategoryPayload {
  name?: string;
  description?: string;
  language?: string;
  color?: string;
  isActive?: boolean;
  order?: number;
}

export interface ForumCategoryFilter {
  language?: string;
  isActive?: boolean;
}

export class ForumCategoriesService {
  static async getForumCategories(filter?: ForumCategoryFilter) {
    const conditions = [];
    
    if (filter?.language) {
      conditions.push(eq(forumCategories.language, filter.language as any));
    }
    if (filter?.isActive !== undefined) {
      conditions.push(eq(forumCategories.isActive, filter.isActive));
    }

    const result = await db
      .select({
        id: forumCategories.id,
        name: forumCategories.name,
        description: forumCategories.description,
        language: forumCategories.language,
        color: forumCategories.color,
        isActive: forumCategories.isActive,
        order: forumCategories.order,
        createdAt: forumCategories.createdAt,
        // Count topics and posts (mock for now)
        topicsCount: sql<number>`FLOOR(RANDOM() * 50 + 1)`,
        postsCount: sql<number>`FLOOR(RANDOM() * 300 + 1)`,
      })
      .from(forumCategories)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(forumCategories.order, forumCategories.createdAt);

    // Convert Date objects to ISO strings for JSON serialization
    return result.map(category => ({
      ...category,
      topicsCount: Number(category.topicsCount),
      postsCount: Number(category.postsCount),
      createdAt: category.createdAt?.toISOString() || null,
    }));
  }

  static async getForumCategoryById(id: string) {
    const result = await db
      .select()
      .from(forumCategories)
      .where(eq(forumCategories.id, id))
      .limit(1);
    
    return result[0] || null;
  }

  static async createForumCategory(data: CreateForumCategoryPayload) {
    const result = await db
      .insert(forumCategories)
      .values({
        ...data,
        language: data.language as any,
        createdAt: new Date(),
      })
      .returning();

    return result[0];
  }

  static async updateForumCategory(id: string, data: Partial<UpdateForumCategoryPayload>) {
    const result = await db
      .update(forumCategories)
      .set({
        ...data,
        language: data.language as any,
      })
      .where(eq(forumCategories.id, id))
      .returning();

    return result[0] || null;
  }

  static async deleteForumCategory(id: string) {
    const result = await db
      .delete(forumCategories)
      .where(eq(forumCategories.id, id))
      .returning();

    return result[0] || null;
  }
}