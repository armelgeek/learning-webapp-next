import { NotificationService } from '../service';
import { CreateNotificationPayload } from '../../config/notification.types';

export async function createNotificationUseCase(data: CreateNotificationPayload) {
  try {
    const notification = await NotificationService.createNotification(data);
    return { success: true, data: notification };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create notification' 
    };
  }
}

export async function markNotificationAsReadUseCase(id: string) {
  try {
    const notification = await NotificationService.markAsRead(id);
    if (!notification) {
      return { success: false, error: 'Notification not found' };
    }
    return { success: true, data: notification };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to mark notification as read' 
    };
  }
}

export async function markAllNotificationsAsReadUseCase(userId: string) {
  try {
    await NotificationService.markAllAsRead(userId);
    return { success: true, data: { message: 'All notifications marked as read' } };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to mark all notifications as read' 
    };
  }
}

export async function deleteNotificationUseCase(id: string) {
  try {
    const notification = await NotificationService.deleteNotification(id);
    if (!notification) {
      return { success: false, error: 'Notification not found' };
    }
    return { success: true, data: notification };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete notification' 
    };
  }
}

// Helper functions for common notification types
export async function createReminderNotificationUseCase(userId: string, message: string) {
  return createNotificationUseCase({
    userId,
    type: 'reminder',
    title: 'Practice Reminder',
    message,
  });
}

export async function createAchievementNotificationUseCase(userId: string, achievement: string) {
  return createNotificationUseCase({
    userId,
    type: 'achievement',
    title: 'Achievement Unlocked!',
    message: `Congratulations! You've ${achievement}`,
  });
}

export async function createNewLessonNotificationUseCase(userId: string, lessonTitle: string) {
  return createNotificationUseCase({
    userId,
    type: 'new_lesson',
    title: 'New Lesson Available',
    message: `A new lesson "${lessonTitle}" is now available for you to practice!`,
  });
}