import { describe, it, expect, beforeEach } from 'vitest';
import { GoogleSheetsMapper } from './googleSheetsMapper';
import { dataRepository } from './dataRepository';
import { ContentItem } from '../types/content';
import { User } from '../types/user';
import { ValidationError } from '../services/errorFramework';

describe('Phase 4 Data Layer & Storage Abstraction', () => {
  it('maps User domain model to Google Sheet row and back', () => {
    const user: User = {
      userId: 10,
      fullName: 'Test User',
      email: 'test@infineo.com',
      role: 'Employee',
      active: true,
      createdAt: '2026-07-30T10:00:00Z',
      updatedAt: '2026-07-30T10:00:00Z',
    };

    const row = GoogleSheetsMapper.userToRow(user);
    expect(row[0]).toBe(10);
    expect(row[2]).toBe('test@infineo.com');

    const reconstructed = GoogleSheetsMapper.rowToUser(row);
    expect(reconstructed.userId).toBe(user.userId);
    expect(reconstructed.email).toBe(user.email);
    expect(reconstructed.role).toBe(user.role);
    expect(reconstructed.active).toBe(true);
  });

  it('maps ContentItem domain model to Google Sheet row and back', () => {
    const item: ContentItem = {
      contentId: 500,
      seriesId: 1,
      subSeriesId: 5,
      workingTitle: 'Test Content',
      realLifeProblem: 'Test problem text',
      episodeNumber: 15,
      currentStatus: 'Script WIP',
      assignedUserId: 3,
      createdByUserId: 4,
      currentCanvaLink: 'https://canva.com/test',
      metadata: {
        youtubeTitle: 'YT Title',
        youtubeDescription: 'YT Desc',
        youtubeTags: 'tag1, tag2',
        instagramCaption: 'Insta Cap',
        instagramPoll: 'Poll Q',
        linkedInCaption: 'LI Cap',
        twitterCaption: 'Twit Cap',
      },
      scheduled: { YouTube: true, Instagram: false, LinkedIn: false, Twitter: false },
      uploaded: { YouTube: false, Instagram: false, LinkedIn: false, Twitter: false },
      createdAt: '2026-07-30T10:00:00Z',
      updatedAt: '2026-07-30T10:00:00Z',
    };

    const row = GoogleSheetsMapper.contentToRow(item, 'Neo Ki Paathshala', 'Childhood Values');
    expect(row[0]).toBe(500);
    expect(row[1]).toBe('Neo Ki Paathshala');
    expect(row[4]).toBe('Test problem text');

    const reconstructed = GoogleSheetsMapper.rowToContent(
      row,
      () => 1,
      () => 5
    );

    expect(reconstructed.contentId).toBe(item.contentId);
    expect(reconstructed.realLifeProblem).toBe(item.realLifeProblem);
    expect(reconstructed.episodeNumber).toBe(15);
    expect(reconstructed.scheduled.YouTube).toBe(true);
  });

  it('creates and retrieves ContentItem using dataRepository', async () => {
    const newItem = await dataRepository.createContentItem({
      seriesId: 1,
      realLifeProblem: 'Overcoming procrastination in daily work',
      currentStatus: 'Idea',
      createdByUserId: 3,
      metadata: {
        youtubeTitle: '',
        youtubeDescription: '',
        youtubeTags: '',
        instagramCaption: '',
        instagramPoll: '',
        linkedInCaption: '',
        twitterCaption: '',
      },
      scheduled: { YouTube: false, Instagram: false, LinkedIn: false, Twitter: false },
      uploaded: { YouTube: false, Instagram: false, LinkedIn: false, Twitter: false },
    });

    expect(newItem.contentId).toBeGreaterThan(100);
    expect(newItem.realLifeProblem).toContain('procrastination');

    const fetched = await dataRepository.getContentItemById(newItem.contentId);
    expect(fetched).toBeDefined();
    expect(fetched?.contentId).toBe(newItem.contentId);
  });

  it('getUserByEmail is case-insensitive and trims whitespace', async () => {
    const user = await dataRepository.getUserByEmail('  Admin@Infineo.COM  ');
    expect(user).toBeDefined();
    expect(user?.role).toBe('Admin');
  });

  it('enforces email uniqueness when creating user', async () => {
    await expect(
      dataRepository.createUser({
        fullName: 'Duplicate User',
        email: 'admin@infineo.com',
        role: 'Employee',
        active: true,
      })
    ).rejects.toThrow(ValidationError);
  });

  it('enforces episode number uniqueness within series', async () => {
    const item1 = await dataRepository.createContentItem({
      seriesId: 1,
      realLifeProblem: 'Episode 50 test item 1',
      currentStatus: 'Completed',
      createdByUserId: 3,
      metadata: {
        youtubeTitle: '',
        youtubeDescription: '',
        youtubeTags: '',
        instagramCaption: '',
        instagramPoll: '',
        linkedInCaption: '',
        twitterCaption: '',
      },
      scheduled: { YouTube: false, Instagram: false, LinkedIn: false, Twitter: false },
      uploaded: { YouTube: false, Instagram: false, LinkedIn: false, Twitter: false },
    });

    await dataRepository.updateContentItem(item1.contentId, { episodeNumber: 50 });

    const item2 = await dataRepository.createContentItem({
      seriesId: 1,
      realLifeProblem: 'Episode 50 test item 2',
      currentStatus: 'Completed',
      createdByUserId: 3,
      metadata: {
        youtubeTitle: '',
        youtubeDescription: '',
        youtubeTags: '',
        instagramCaption: '',
        instagramPoll: '',
        linkedInCaption: '',
        twitterCaption: '',
      },
      scheduled: { YouTube: false, Instagram: false, LinkedIn: false, Twitter: false },
      uploaded: { YouTube: false, Instagram: false, LinkedIn: false, Twitter: false },
    });

    await expect(
      dataRepository.updateContentItem(item2.contentId, { episodeNumber: 50 })
    ).rejects.toThrow(ValidationError);
  });
});
