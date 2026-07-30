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
import { googleSheetsClient } from './googleSheetsClient';
import { GoogleSheetsMapper } from './googleSheetsMapper';

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
    const rows = await googleSheetsClient.fetchSheetData('Users');
    if (rows) {
      const validRows = rows.filter(r => r.some(cell => cell !== '' && cell !== null && cell !== undefined));
      return validRows.map((r, idx) => GoogleSheetsMapper.rowToUser(r, idx + 1));
    }
    return memoryRepository.getUsers();
  }

  async getUserById(userId: number): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find(u => u.userId === userId);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find(u => u.email === email);
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

    const createdUser = await memoryRepository.createUser(user);
    await googleSheetsClient.appendSheetRow('Users', GoogleSheetsMapper.userToRow(createdUser));
    return createdUser;
  }

  async updateUser(userId: number, updates: Partial<User>): Promise<User> {
    if (updates.email && !isValidEmail(updates.email)) {
      throw new ValidationError('Invalid email address provided.');
    }
    const updated = await memoryRepository.updateUser(userId, updates);
    await googleSheetsClient.updateSheetRow('Users', 0, userId, GoogleSheetsMapper.userToRow(updated));
    return updated;
  }

  // Content Operations
  async getContentItems(): Promise<ContentItem[]> {
    const rows = await googleSheetsClient.fetchSheetData('Content');
    if (rows) {
      const series = await this.getSeries();
      const subSeries = await this.getSubSeries();
      const seriesIdMap = (name: string) => series.find(s => s.name === name)?.seriesId || 0;
      const subSeriesIdMap = (name: string) => subSeries.find(s => s.name === name)?.subSeriesId;
      return rows.map(r => GoogleSheetsMapper.rowToContent(r, seriesIdMap, subSeriesIdMap));
    }
    return memoryRepository.getContentItems();
  }

  async getContentItemById(contentId: number): Promise<ContentItem | undefined> {
    const items = await this.getContentItems();
    return items.find(i => i.contentId === contentId);
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

    const created = await memoryRepository.createContentItem(item);
    const series = await this.getSeries();
    const subSeries = await this.getSubSeries();
    const seriesName = series.find(s => s.seriesId === created.seriesId)?.name || '';
    const subSeriesName = subSeries.find(s => s.subSeriesId === created.subSeriesId)?.name;
    
    await googleSheetsClient.appendSheetRow('Content', GoogleSheetsMapper.contentToRow(created, seriesName, subSeriesName));
    return created;
  }

  async updateContentItem(contentId: number, updates: Partial<ContentItem>): Promise<ContentItem> {
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

    const updated = await memoryRepository.updateContentItem(contentId, updates);
    const series = await this.getSeries();
    const subSeries = await this.getSubSeries();
    const seriesName = series.find(s => s.seriesId === updated.seriesId)?.name || '';
    const subSeriesName = subSeries.find(s => s.subSeriesId === updated.subSeriesId)?.name;

    await googleSheetsClient.updateSheetRow('Content', 0, contentId, GoogleSheetsMapper.contentToRow(updated, seriesName, subSeriesName));
    return updated;
  }

  // Activity Log Operations
  async getActivityLogs(contentId?: number): Promise<ActivityLogItem[]> {
    const rows = await googleSheetsClient.fetchSheetData('Activity Log');
    if (rows) {
      const logs = rows.map(r => GoogleSheetsMapper.rowToActivity(r));
      return contentId ? logs.filter(l => l.contentId === contentId) : logs;
    }
    return memoryRepository.getActivityLogs(contentId);
  }

  async logActivity(
    log: Omit<ActivityLogItem, 'activityId' | 'timestamp'>
  ): Promise<ActivityLogItem> {
    const created = await memoryRepository.logActivity(log);
    await googleSheetsClient.appendSheetRow('Activity Log', GoogleSheetsMapper.activityToRow(created));
    return created;
  }

  // Notification Operations (Left to mock memory for now)
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

  // Settings Operations (Left to mock memory for now)
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
