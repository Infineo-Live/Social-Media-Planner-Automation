import { Series, SubSeries } from '../types/content';

export interface AppConfig {
  appName: string;
  companyName: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  pageSize: number;
  enableEmailNotifications: boolean;
  enableMockData: boolean;
  defaultSeries: Series[];
  defaultSubSeries: SubSeries[];
  googleClientId: string;
  googleSheetId: string;
  appsScriptUrl: string;
}

export const initialSeries: Series[] = [
  { seriesId: 1, name: 'Neo Ki Paathshala', shortCode: 'NKPS', active: true },
  { seriesId: 2, name: 'Ancient Traditions Modern Curiosity', shortCode: 'ATMC', active: true },
  { seriesId: 3, name: 'Fun Reel', shortCode: 'FUN', active: true },
  { seriesId: 4, name: 'Ad Reel', shortCode: 'AD', active: true },
  { seriesId: 5, name: 'Prayer / Shloka', shortCode: 'PS', active: true },
];

export const initialSubSeries: SubSeries[] = [
  { subSeriesId: 1, name: 'Janmashtami', active: true },
  { subSeriesId: 2, name: 'Ganpati', active: true },
  { subSeriesId: 3, name: 'Diwali', active: true },
  { subSeriesId: 4, name: 'Navratri', active: true },
  { subSeriesId: 5, name: 'Childhood Values', active: true },
  { subSeriesId: 6, name: 'Relationships', active: true },
];

export const appConfig: AppConfig = {
  appName: import.meta.env.VITE_APP_NAME || 'Infineo Social Media Planner',
  companyName: import.meta.env.VITE_COMPANY_NAME || 'Infineo',
  timezone: import.meta.env.VITE_TIMEZONE || 'Asia/Kolkata',
  dateFormat: 'DD MMM YYYY',
  timeFormat: 'HH:mm',
  pageSize: 25,
  enableEmailNotifications: import.meta.env.VITE_ENABLE_EMAIL_NOTIFICATIONS !== 'false',
  enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA !== 'false',
  defaultSeries: initialSeries,
  defaultSubSeries: initialSubSeries,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
  googleSheetId: import.meta.env.VITE_GOOGLE_SHEET_ID || 'YOUR_GOOGLE_SHEET_ID',
  appsScriptUrl: import.meta.env.VITE_APPS_SCRIPT_URL || 'YOUR_APPS_SCRIPT_URL',
};
