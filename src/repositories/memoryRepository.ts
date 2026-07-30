import {
  IUserRepository,
  IContentRepository,
  IActivityRepository,
  INotificationRepository,
  ISettingsRepository,
} from './interfaces';
import { User } from '../types/user';
import { ContentItem, Series, SubSeries } from '../types/content';
import { ActivityLogItem } from '../types/activity';
import { AppNotification } from '../types/notification';
import { appConfig, AppConfig } from '../config/appConfig';

// Initial Seed Users (Empty - all data fetched directly from Google Sheets)
const seedUsers: User[] = [];

// Initial Seed Content Items (Empty - all data fetched directly from Google Sheets)
const seedContent: ContentItem[] = [];

class MemoryRepository
  implements
    IUserRepository,
    IContentRepository,
    IActivityRepository,
    INotificationRepository,
    ISettingsRepository
{
  private users: User[] = [...seedUsers];
  private content: ContentItem[] = [...seedContent];
  private activities: ActivityLogItem[] = [];
  private notifications: AppNotification[] = [];
  private config: AppConfig = { ...appConfig };
  private series: Series[] = [...appConfig.defaultSeries];
  private subSeries: SubSeries[] = [...appConfig.defaultSubSeries];

  // User Methods
  async getUsers(): Promise<User[]> {
    return [...this.users];
  }

  async getUserById(userId: number): Promise<User | undefined> {
    return this.users.find((u) => u.userId === userId);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  async createUser(user: Omit<User, 'userId' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const newUser: User = {
      ...user,
      userId: Math.max(0, ...this.users.map((u) => u.userId)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(userId: number, updates: Partial<User>): Promise<User> {
    const index = this.users.findIndex((u) => u.userId === userId);
    if (index === -1) throw new Error(`User with ID ${userId} not found.`);
    const updated = {
      ...this.users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.users[index] = updated;
    return updated;
  }

  // Content Methods
  async getContentItems(): Promise<ContentItem[]> {
    return [...this.content];
  }

  async getContentItemById(contentId: number): Promise<ContentItem | undefined> {
    return this.content.find((c) => c.contentId === contentId);
  }

  async createContentItem(
    item: Omit<ContentItem, 'contentId' | 'createdAt' | 'updatedAt'>
  ): Promise<ContentItem> {
    const newContent: ContentItem = {
      ...item,
      contentId: Math.max(100, ...this.content.map((c) => c.contentId)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.content.push(newContent);
    return newContent;
  }

  async updateContentItem(contentId: number, updates: Partial<ContentItem>): Promise<ContentItem> {
    const index = this.content.findIndex((c) => c.contentId === contentId);
    if (index === -1) throw new Error(`ContentItem with ID ${contentId} not found.`);
    const updated = {
      ...this.content[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.content[index] = updated;
    return updated;
  }

  // Activity Log Methods
  async getActivityLogs(contentId?: number): Promise<ActivityLogItem[]> {
    if (contentId) {
      return this.activities.filter((a) => a.contentId === contentId);
    }
    return [...this.activities].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async logActivity(
    log: Omit<ActivityLogItem, 'activityId' | 'timestamp'>
  ): Promise<ActivityLogItem> {
    const newLog: ActivityLogItem = {
      ...log,
      activityId: Math.max(0, ...this.activities.map((a) => a.activityId)) + 1,
      timestamp: new Date().toISOString(),
    };
    this.activities.push(newLog);
    return newLog;
  }

  // Notification Methods
  async getNotificationsForUser(userId: number): Promise<AppNotification[]> {
    return this.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async createNotification(
    notification: Omit<AppNotification, 'notificationId' | 'timestamp' | 'read'>
  ): Promise<AppNotification> {
    const newNotif: AppNotification = {
      ...notification,
      notificationId: Math.max(0, ...this.notifications.map((n) => n.notificationId)) + 1,
      timestamp: new Date().toISOString(),
      read: false,
    };
    this.notifications.push(newNotif);
    return newNotif;
  }

  async markAsRead(notificationId: number): Promise<void> {
    const notif = this.notifications.find((n) => n.notificationId === notificationId);
    if (notif) notif.read = true;
  }

  async markAllAsRead(userId: number): Promise<void> {
    this.notifications.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
  }

  // Settings Methods
  async getConfig(): Promise<AppConfig> {
    return { ...this.config };
  }

  async updateConfig(updates: Partial<AppConfig>): Promise<AppConfig> {
    this.config = { ...this.config, ...updates };
    return { ...this.config };
  }

  async getSeries(): Promise<Series[]> {
    return [...this.series];
  }

  async getSubSeries(seriesId?: number): Promise<SubSeries[]> {
    if (seriesId) {
      return this.subSeries.filter((s) => s.seriesId === seriesId);
    }
    return [...this.subSeries];
  }

  async addSeries(series: Omit<Series, 'seriesId'>): Promise<Series> {
    const newSeries: Series = {
      ...series,
      seriesId: Math.max(0, ...this.series.map((s) => s.seriesId)) + 1,
    };
    this.series.push(newSeries);
    return newSeries;
  }

  async addSubSeries(subSeries: Omit<SubSeries, 'subSeriesId'>): Promise<SubSeries> {
    const newSubSeries: SubSeries = {
      ...subSeries,
      subSeriesId: Math.max(0, ...this.subSeries.map((s) => s.subSeriesId)) + 1,
    };
    this.subSeries.push(newSubSeries);
    return newSubSeries;
  }

  async updateSeries(seriesId: number, updates: Partial<Series>): Promise<Series> {
    const index = this.series.findIndex((s) => s.seriesId === seriesId);
    if (index === -1) throw new Error(`Series ${seriesId} not found.`);
    const updated = { ...this.series[index], ...updates };
    this.series[index] = updated;
    return updated;
  }
}

export const memoryRepository = new MemoryRepository();
