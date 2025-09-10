import { NotificationService } from '../service';
import { NotificationFilter } from '../../config/notification.types';

export async function getNotificationsUseCase(filter: NotificationFilter) {
  try {
    const notifications = await NotificationService.getNotifications(filter);
    return { success: true, data: notifications };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch notifications' 
    };
  }
}

export async function getNotificationByIdUseCase(id: string) {
  try {
    const notification = await NotificationService.getNotificationById(id);
    if (!notification) {
      return { success: false, error: 'Notification not found' };
    }
    return { success: true, data: notification };
  } catch (error) {
    console.error('Error fetching notification:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch notification' 
    };
  }
}

export async function getNotificationSummaryUseCase(userId: string) {
  try {
    const summary = await NotificationService.getNotificationSummary(userId);
    return { success: true, data: summary };
  } catch (error) {
    console.error('Error fetching notification summary:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch notification summary' 
    };
  }
}