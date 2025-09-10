import { z } from 'zod';
import { 
  createNotificationSchema, 
  updateNotificationSchema, 
  notificationFilterSchema 
} from './notification.schema';

export type CreateNotificationPayload = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationPayload = z.infer<typeof updateNotificationSchema>;
export type NotificationFilter = z.infer<typeof notificationFilterSchema>;

export type NotificationType = 'reminder' | 'achievement' | 'new_lesson';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface NotificationSummary {
  total: number;
  unread: number;
  byType: {
    reminder: number;
    achievement: number;
    new_lesson: number;
  };
}