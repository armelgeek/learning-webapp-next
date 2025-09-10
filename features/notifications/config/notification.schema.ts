import { z } from 'zod';

export const createNotificationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  type: z.enum(['reminder', 'achievement', 'new_lesson']),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
});

export const updateNotificationSchema = z.object({
  id: z.string(),
  read: z.boolean().default(false),
});

export const notificationFilterSchema = z.object({
  userId: z.string().optional(),
  type: z.enum(['reminder', 'achievement', 'new_lesson']).optional(),
  read: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});