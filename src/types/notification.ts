export interface AppNotification {
  notificationId: number;
  userId: number;
  contentId: number;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface EmailMessage {
  recipientEmail: string;
  subject: string;
  bodyText: string;
  bodyHtml: string;
}
