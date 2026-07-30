import {
  IUserRepository,
  IContentRepository,
  IActivityRepository,
  INotificationRepository,
  ISettingsRepository,
} from './interfaces';
import { memoryRepository } from './memoryRepository';
import { User } from '../types/user';
import { ContentItem, Series, SubSeries } from '../types/content';
import { ActivityLogItem } from '../types/activity';
import { AppNotification } from '../types/notification';
import { AppConfig } from '../config/appConfig';
import { ValidationError } from '../services/errorFramework';
import { isValidEmail, isNonEmptyString } from '../utils/validationUtils';

export class DataRepository
  implements
    IUserRepository,
    IContentRepository,
    IActivityRepository,
    INotificationRepository,
    ISettingsRepository
{
  // User Operations
  async getUsers(): Promise<User[]> {
    return memoryRepository.getUsers();
  }

  async getUserById(userId: number): Promise<User | undefined> {
    return memoryRepository.getUserById(userId);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return memoryRepository.getUserByEmail(email);
  }

  async createUser(user: Omit<User, 'userId' | 'createdAt' | 'updatedAt'>): Promise<User> {
    if (!isValidEmail(user.email)) {
      throw new ValidationError('Invalid email address provided.');
    }
    if (!isNonEmptyString(user.fullName)) {
      throw new ValidationError('Full name is required.');
    }

    const existing = await this.getUserByEmail(user.email);
    if (existing) {
      throw new ValidationError(`User with email '${user.email}' already exists.`);
    }

    return memoryRepository.createUser(user);
  }

  async updateUser(userId: number, updates: Partial<User>): Promise<User> {
    if (updates.email && !isValidEmail(updates.email)) {
      throw new ValidationError('Invalid email address provided.');
    }
    return memoryRepository.updateUser(userId, updates);
  }

  // Content Operations
  async getContentItems(): Promise<ContentItem[]> {
    return memoryRepository.getContentItems();
  }

  async getContentItemById(contentId: number): Promise<ContentItem | undefined> {
    return memoryRepository.getContentItemById(contentId);
  }

  async createContentItem(
    item: Omit<ContentItem, 'contentId' | 'createdAt' | 'updatedAt'>
  ): Promise<ContentItem> {
    if (!item.seriesId) {
      throw new ValidationError('Every Content Item must belong to a primary Series.');
    }
    if (!isNonEmptyString(item.realLifeProblem)) {
      throw new ValidationError('Real Life Problem description is required.');
    }

    return memoryRepository.createContentItem(item);
  }

  async updateContentItem(contentId: number, updates: Partial<ContentItem>): Promise<ContentItem> {
    // Validate episode number uniqueness per series if updating episode number
    if (updates.episodeNumber !== undefined && updates.episodeNumber !== null) {
      const existingItem = await this.getContentItemById(contentId);
      const targetSeriesId = updates.seriesId || existingItem?.seriesId;
      if (targetSeriesId) {
        const allContent = await this.getContentItems();
        const duplicate = allContent.find(
          (c) =>
            c.contentId !== contentId &&
            c.seriesId === targetSeriesId &&
            c.episodeNumber === updates.episodeNumber
        );
        if (duplicate) {
          throw new ValidationError(
            `Episode number ${updates.episodeNumber} already exists in Series ID ${targetSeriesId}.`
          );
        }
      }
    }

    return memoryRepository.updateContentItem(contentId, updates);
  }

  // Activity Log Operations
  async getActivityLogs(contentId?: number): Promise<ActivityLogItem[]> {
    return memoryRepository.getActivityLogs(contentId);
  }

  async logActivity(
    log: Omit<ActivityLogItem, 'activityId' | 'timestamp'>
  ): Promise<ActivityLogItem> {
    return memoryRepository.logActivity(log);
  }

  // Notification Operations
  async getNotificationsForUser(userId: number): Promise<AppNotification[]> {
    return memoryRepository.getNotificationsForUser(userId);
  }

  async createNotification(
    notification: Omit<AppNotification, 'notificationId' | 'timestamp' | 'read'>
  ): Promise<AppNotification> {
    return memoryRepository.createNotification(notification);
  }

  async markAsRead(notificationId: number): Promise<void> {
    return memoryRepository.markAsRead(notificationId);
  }

  async markAllAsRead(userId: number): Promise<void> {
    return memoryRepository.markAllAsRead(userId);
  }

  // Settings Operations
  async getConfig(): Promise<AppConfig> {
    return memoryRepository.getConfig();
  }

  async updateConfig(updates: Partial<AppConfig>): Promise<AppConfig> {
    return memoryRepository.updateConfig(updates);
  }

  async getSeries(): Promise<Series[]> {
    return memoryRepository.getSeries();
  }

  async getSubSeries(seriesId?: number): Promise<SubSeries[]> {
    return memoryRepository.getSubSeries(seriesId);
  }

  async addSeries(series: Omit<Series, 'seriesId'>): Promise<Series> {
    if (!isNonEmptyString(series.name) || !isNonEmptyString(series.shortCode)) {
      throw new ValidationError('Series name and short code are required.');
    }
    const allSeries = await this.getSeries();
    if (allSeries.some((s) => s.name.toLowerCase() === series.name.toLowerCase())) {
      throw new ValidationError(`Series name '${series.name}' already exists.`);
    }
    return memoryRepository.addSeries(series);
  }

  async addSubSeries(subSeries: Omit<SubSeries, 'subSeriesId'>): Promise<SubSeries> {
    if (!isNonEmptyString(subSeries.name)) {
      throw new ValidationError('Sub-Series name is required.');
    }
    return memoryRepository.addSubSeries(subSeries);
  }

  async updateSeries(seriesId: number, updates: Partial<Series>): Promise<Series> {
    return memoryRepository.updateSeries(seriesId, updates);
  }
}

export const dataRepository = new DataRepository();
