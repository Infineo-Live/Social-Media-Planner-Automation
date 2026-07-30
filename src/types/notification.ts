export interface AppNotification {
  notificationId: number;
  userId: number;
  contentId: number;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
