import { db } from '@/drizzle/db';
import { notifications } from '@/drizzle/schema';
import { and, count, desc, eq } from 'drizzle-orm';
import { CreateNotificationPayload, NotificationFilter } from '../config/notification.types';

export class NotificationService {
  static async getNotifications(filter: NotificationFilter) {
    const conditions = [];
    
    if (filter.userId) {
      conditions.push(eq(notifications.userId, filter.userId));
    }
    if (filter.type) {
      conditions.push(eq(notifications.type, filter.type));
    }
    if (filter.read !== undefined) {
      conditions.push(eq(notifications.read, filter.read));
    }

    const query = db
      .select()
      .from(notifications)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(notifications.createdAt));

    if (filter.limit) {
      query.limit(filter.limit);
    }
    if (filter.offset) {
      query.offset(filter.offset);
    }

    return await query;
  }

  static async getNotificationById(id: string) {
    const result = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, id))
      .limit(1);
    
    return result[0] || null;
  }

  static async createNotification(data: CreateNotificationPayload) {
    const result = await db
      .insert(notifications)
      .values({
        ...data,
        read: false,
        createdAt: new Date(),
      })
      .returning();

    return result[0];
  }

  static async markAsRead(id: string) {
    const result = await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
      .returning();

    return result[0] || null;
  }

  static async markAllAsRead(userId: string) {
    const result = await db
      .update(notifications)
      .set({ read: true })
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.read, false)
      ));

    return result;
  }

  static async deleteNotification(id: string) {
    const result = await db
      .delete(notifications)
      .where(eq(notifications.id, id))
      .returning();

    return result[0] || null;
  }

  static async getNotificationSummary(userId: string) {
    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(notifications)
      .where(eq(notifications.userId, userId));

    // Get unread count
    const unreadResult = await db
      .select({ count: count() })
      .from(notifications)
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.read, false)
      ));

    // Get counts by type
    const reminderResult = await db
      .select({ count: count() })
      .from(notifications)
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.type, 'reminder')
      ));

    const achievementResult = await db
      .select({ count: count() })
      .from(notifications)
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.type, 'achievement')
      ));

    const newLessonResult = await db
      .select({ count: count() })
      .from(notifications)
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.type, 'new_lesson')
      ));

    return {
      total: totalResult[0]?.count || 0,
      unread: unreadResult[0]?.count || 0,
      byType: {
        reminder: reminderResult[0]?.count || 0,
        achievement: achievementResult[0]?.count || 0,
        new_lesson: newLessonResult[0]?.count || 0,
      },
    };
  }
}