import { describe, it, expect, beforeEach } from 'vitest';
import { NotificationService } from './notificationService';
import { dataRepository } from '../repositories/dataRepository';
import { User } from '../types/user';
import { ContentItem } from '../types/content';
import { appConfig } from '../config/appConfig';

describe('Phase 8 Notification Engine', () => {
  let user: User;
  let actor: User;
  let testItem: ContentItem;

  beforeEach(async () => {
    user = (await dataRepository.getUserByEmail('rahul@infineo.com'))!;
    actor = (await dataRepository.getUserByEmail('manager@infineo.com'))!;
    const items = await dataRepository.getContentItems();
    testItem = items[0];
  });

  it('creates in-app notifications successfully', async () => {
    const notif = await NotificationService.createNotification(
      user.userId,
      testItem.contentId,
      'Task Review Ready',
      'Your script has been submitted for review.'
    );
    expect(notif).toBeDefined();
    expect(notif?.userId).toBe(user.userId);
  });

  it('suppresses duplicate notifications within cache period', async () => {
    const title = `Duplicate Test ${Date.now()}`;
    const notif1 = await NotificationService.createNotification(
      user.userId,
      testItem.contentId,
      title,
      'First message'
    );
    expect(notif1).not.toBeNull();

    // Duplicate call immediately suppressed
    const notif2 = await NotificationService.createNotification(
      user.userId,
      testItem.contentId,
      title,
      'Second message'
    );
    expect(notif2).toBeNull();
  });

  it('generates HTML and Plaintext email templates matching docs/016', () => {
    const email = NotificationService.generateEmailTemplate(
      'STAGE_APPROVED',
      user,
      testItem,
      actor
    );

    expect(email.recipientEmail).toBe(user.email);
    expect(email.subject).toContain('Content #');
    expect(email.bodyText).toContain('approved');
    expect(email.bodyHtml).toContain('<div');
  });

  it('respects enableEmailNotifications feature flag', async () => {
    const email = NotificationService.generateEmailTemplate(
      'STAGE_APPROVED',
      user,
      testItem,
      actor
    );

    appConfig.enableEmailNotifications = true;
    const sentTrue = await NotificationService.sendEmailNotification(email);
    expect(sentTrue).toBe(true);

    appConfig.enableEmailNotifications = false;
    const sentFalse = await NotificationService.sendEmailNotification(email);
    expect(sentFalse).toBe(false);

    // Restore default
    appConfig.enableEmailNotifications = true;
  });
});
