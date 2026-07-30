import { appConfig } from '../config/appConfig';
import { logger } from '../services/logger';

export class GoogleSheetsClient {
  private appsScriptUrl: string;

  constructor() {
    this.appsScriptUrl = appConfig.appsScriptUrl;
  }

  async fetchSheetData(sheetName: string): Promise<any[][] | null> {
    if (appConfig.enableMockData || !this.appsScriptUrl || this.appsScriptUrl.includes('YOUR_')) {
      logger.debug(`[GoogleSheetsClient] Using mock data store for sheet: ${sheetName}`);
      return null; // Signals repository to use memory data store
    }

    try {
      const response = await fetch(`${this.appsScriptUrl}?sheet=${encodeURIComponent(sheetName)}`);
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      return data.rows || [];
    } catch (err) {
      logger.error(`[GoogleSheetsClient] Failed to fetch sheet ${sheetName}`, { error: err });
      return null;
    }
  }

  async appendSheetRow(sheetName: string, row: any[]): Promise<boolean> {
    if (appConfig.enableMockData || !this.appsScriptUrl || this.appsScriptUrl.includes('YOUR_')) {
      logger.debug(`[GoogleSheetsClient] Mock append row to ${sheetName}`, { row });
      return true;
    }

    try {
      const response = await fetch(this.appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'append', sheet: sheetName, row }),
      });
      return response.ok;
    } catch (err) {
      logger.error(`[GoogleSheetsClient] Failed to append row to ${sheetName}`, { error: err });
      return false;
    }
  }

  async updateSheetRow(sheetName: string, idColumnIndex: number, rowId: string | number, row: any[]): Promise<boolean> {
    if (appConfig.enableMockData || !this.appsScriptUrl || this.appsScriptUrl.includes('YOUR_')) {
      logger.debug(`[GoogleSheetsClient] Mock update row in ${sheetName}`, { rowId, row });
      return true;
    }

    try {
      const response = await fetch(this.appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'update', sheet: sheetName, idColumnIndex, rowId, row }),
      });
      return response.ok;
    } catch (err) {
      logger.error(`[GoogleSheetsClient] Failed to update row in ${sheetName}`, { error: err });
      return false;
    }
  }
}

export const googleSheetsClient = new GoogleSheetsClient();
