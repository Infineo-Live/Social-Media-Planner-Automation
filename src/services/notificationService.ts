import { appConfig } from '../config/appConfig';
import { dataRepository } from '../repositories/dataRepository';
import { AppNotification } from '../types/notification';
import { ContentItem } from '../types/content';
import { User } from '../types/user';
import { logger } from './logger';

export interface EmailMessage {
  recipientEmail: string;
  subject: string;
  bodyText: string;
  bodyHtml: string;
}

export class NotificationService {
  private static recentNotifCache: Set<string> = new Set();

  // Create In-App Notification with duplicate prevention
  static async createNotification(
    userId: number,
    contentId: number,
    title: string,
    message: string
  ): Promise<AppNotification | null> {
    const cacheKey = `${userId}:${contentId}:${title}`;
    if (this.recentNotifCache.has(cacheKey)) {
      logger.debug(`[NotificationService] Duplicate notification suppressed: ${cacheKey}`);
      return null;
    }

    this.recentNotifCache.add(cacheKey);
    setTimeout(() => this.recentNotifCache.delete(cacheKey), 5000);

    const notif = await dataRepository.createNotification({
      userId,
      contentId,
      title,
      message,
    });

    logger.info(`Notification sent to User #${userId}: ${title}`);
    return notif;
  }

  // Generate Email Templates per docs/016
  static generateEmailTemplate(
    templateType:
      | 'IDEA_SUBMITTED'
      | 'STAGE_APPROVED'
      | 'STAGE_REJECTED'
      | 'TASK_ASSIGNED'
      | 'SCHEDULED',
    recipient: User,
    item: ContentItem,
    actor: User,
    notes?: string
  ): EmailMessage {
    const titleOrProblem = item.workingTitle || item.realLifeProblem;
    let subject = '';
    let bodyText = '';

    switch (templateType) {
      case 'IDEA_SUBMITTED':
        subject = `[Infineo Planner] New Idea Submitted: #${item.contentId}`;
        bodyText = `Hello ${recipient.fullName},\n\nA new idea "${titleOrProblem}" has been submitted by ${actor.fullName} and requires your review.`;
        break;
      case 'STAGE_APPROVED':
        subject = `[Infineo Planner] Content #${item.contentId} Approved (${item.currentStatus})`;
        bodyText = `Hello ${recipient.fullName},\n\nContent #${item.contentId} (${titleOrProblem}) was approved by ${actor.fullName}. New Status: ${item.currentStatus}.`;
        break;
      case 'STAGE_REJECTED':
        subject = `[Infineo Planner] Rejection Notice: Content #${item.contentId}`;
        bodyText = `Hello ${recipient.fullName},\n\nContent #${item.contentId} (${titleOrProblem}) was returned by ${actor.fullName}.\nReason: ${notes || 'No reason specified'}.`;
        break;
      case 'TASK_ASSIGNED':
        subject = `[Infineo Planner] Task Assigned: Content #${item.contentId}`;
        bodyText = `Hello ${recipient.fullName},\n\nYou have been assigned task #${item.contentId} (${titleOrProblem}) by ${actor.fullName}.`;
        break;
      case 'SCHEDULED':
        subject = `[Infineo Planner] Content #${item.contentId} Scheduled`;
        bodyText = `Hello ${recipient.fullName},\n\nContent #${item.contentId} (Episode ${item.episodeNumber}) has been scheduled for publishing by ${actor.fullName}.`;
        break;
    }

    const bodyHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 20px; border-radius: 8px;">
        <h2 style="color: #6366f1;">${subject}</h2>
        <p style="font-size: 15px; color: #cbd5e1;">${bodyText.replace(/\n/g, '<br/>')}</p>
        <hr style="border-color: #334155; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b;">Infineo Social Media Planner — Automated Notification Engine</p>
      </div>
    `;

    return {
      recipientEmail: recipient.email,
      subject,
      bodyText,
      bodyHtml,
    };
  }

  // Send Email (respecting feature flag VITE_ENABLE_EMAIL_NOTIFICATIONS)
  static async sendEmailNotification(emailMsg: EmailMessage): Promise<boolean> {
    if (!appConfig.enableEmailNotifications) {
      logger.info(`[NotificationService] Email disabled by feature flag. Skipping email to ${emailMsg.recipientEmail}`);
      return false;
    }

    logger.info(`[NotificationService] Email dispatched to ${emailMsg.recipientEmail}: "${emailMsg.subject}"`);
    return true;
  }
}
