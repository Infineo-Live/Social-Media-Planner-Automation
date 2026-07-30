import { User } from '../types/user';
import { ContentItem, Series, SubSeries } from '../types/content';
import { ActivityLogItem } from '../types/activity';
import { AppNotification } from '../types/notification';
import { AppConfig } from '../config/appConfig';

export interface IUserRepository {
  getUsers(): Promise<User[]>;
  getUserById(userId: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Omit<User, 'userId' | 'createdAt' | 'updatedAt'>): Promise<User>;
  updateUser(userId: number, updates: Partial<User>): Promise<User>;
}

export interface IContentRepository {
  getContentItems(): Promise<ContentItem[]>;
  getContentItemById(contentId: number): Promise<ContentItem | undefined>;
  createContentItem(item: Omit<ContentItem, 'contentId' | 'createdAt' | 'updatedAt'>): Promise<ContentItem>;
  updateContentItem(contentId: number, updates: Partial<ContentItem>): Promise<ContentItem>;
}

export interface IActivityRepository {
  getActivityLogs(contentId?: number): Promise<ActivityLogItem[]>;
  logActivity(log: Omit<ActivityLogItem, 'activityId' | 'timestamp'>): Promise<ActivityLogItem>;
}

export interface INotificationRepository {
  getNotificationsForUser(userId: number): Promise<AppNotification[]>;
  createNotification(notification: Omit<AppNotification, 'notificationId' | 'timestamp' | 'read'>): Promise<AppNotification>;
  markAsRead(notificationId: number): Promise<void>;
  markAllAsRead(userId: number): Promise<void>;
  queueEmail(email: import('../types/notification').EmailMessage): Promise<void>;
}

export interface ISettingsRepository {
  getConfig(): Promise<AppConfig>;
  updateConfig(updates: Partial<AppConfig>): Promise<AppConfig>;
  getSeries(): Promise<Series[]>;
  getSubSeries(seriesId?: number): Promise<SubSeries[]>;
  addSeries(series: Omit<Series, 'seriesId'>): Promise<Series>;
  addSubSeries(subSeries: Omit<SubSeries, 'subSeriesId'>): Promise<SubSeries>;
  updateSeries(seriesId: number, updates: Partial<Series>): Promise<Series>;
}
