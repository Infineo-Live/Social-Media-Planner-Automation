import { User } from '../types/user';
import { ContentItem, Series, SubSeries } from '../types/content';
import { ActivityLogItem } from '../types/activity';
import { AppNotification } from '../types/notification';

export class GoogleSheetsMapper {
  // Map User domain object <-> Sheet row array
  static userToRow(user: User): (string | number | boolean)[] {
    return [
      user.userId,
      user.fullName,
      user.email,
      user.role,
      user.active,
      user.createdAt,
      user.updatedAt,
    ];
  }

  static rowToUser(row: any[], defaultId: number = 1): User {
    const parsedId = Number(row[0]);
    const userId = (!isNaN(parsedId) && parsedId > 0) ? parsedId : defaultId;
    const roleStr = String(row[3] || 'Employee').trim();
    const role = (['Admin', 'Manager', 'Employee'].includes(roleStr) ? roleStr : 'Employee') as any;
    return {
      userId,
      fullName: String(row[1] || '').trim() || 'Unnamed User',
      email: String(row[2] || '').trim(),
      role,
      active: row[4] !== undefined && row[4] !== '' ? (String(row[4]).toLowerCase() === 'true' || row[4] === true) : true,
      createdAt: String(row[5] || new Date().toISOString()),
      updatedAt: String(row[6] || new Date().toISOString()),
    };
  }

  // Map ContentItem domain object <-> Sheet row array
  static contentToRow(item: ContentItem, seriesName: string, subSeriesName?: string): (string | number | boolean)[] {
    return [
      item.contentId,
      seriesName,
      subSeriesName || '',
      item.workingTitle || '',
      item.realLifeProblem,
      item.mythologyStory || '',
      item.episodeNumber ?? '',
      item.currentStatus,
      item.assignedUserId ?? '',
      item.createdByUserId,
      item.currentCanvaLink || '',
      item.metadata.youtubeTitle,
      item.metadata.youtubeDescription,
      item.metadata.youtubeTags,
      item.metadata.instagramCaption,
      item.metadata.instagramPoll,
      item.metadata.linkedInCaption,
      item.metadata.twitterCaption,
      item.scheduled.YouTube,
      item.scheduled.Instagram,
      item.scheduled.LinkedIn,
      item.scheduled.Twitter,
      item.uploaded.YouTube,
      item.uploaded.Instagram,
      item.uploaded.LinkedIn,
      item.uploaded.Twitter,
      item.createdAt,
      item.updatedAt,
    ];
  }

  static rowToContent(row: any[], seriesIdMap: (name: string) => number, subSeriesIdMap: (name: string) => number | undefined): ContentItem {
    return {
      contentId: Number(row[0]),
      seriesId: seriesIdMap(String(row[1] || '')),
      subSeriesId: row[2] ? subSeriesIdMap(String(row[2])) : undefined,
      workingTitle: String(row[3] || '') || undefined,
      realLifeProblem: String(row[4] || ''),
      mythologyStory: String(row[5] || '') || undefined,
      episodeNumber: row[6] !== '' && row[6] !== undefined && row[6] !== null ? Number(row[6]) : undefined,
      currentStatus: row[7] as any,
      assignedUserId: row[8] ? Number(row[8]) : undefined,
      createdByUserId: Number(row[9]),
      currentCanvaLink: String(row[10] || '') || undefined,
      metadata: {
        youtubeTitle: String(row[11] || ''),
        youtubeDescription: String(row[12] || ''),
        youtubeTags: String(row[13] || ''),
        instagramCaption: String(row[14] || ''),
        instagramPoll: String(row[15] || ''),
        linkedInCaption: String(row[16] || ''),
        twitterCaption: String(row[17] || ''),
      },
      scheduled: {
        YouTube: String(row[18]).toLowerCase() === 'true' || row[18] === true,
        Instagram: String(row[19]).toLowerCase() === 'true' || row[19] === true,
        LinkedIn: String(row[20]).toLowerCase() === 'true' || row[20] === true,
        Twitter: String(row[21]).toLowerCase() === 'true' || row[21] === true,
      },
      uploaded: {
        YouTube: String(row[22]).toLowerCase() === 'true' || row[22] === true,
        Instagram: String(row[23]).toLowerCase() === 'true' || row[23] === true,
        LinkedIn: String(row[24]).toLowerCase() === 'true' || row[24] === true,
        Twitter: String(row[25]).toLowerCase() === 'true' || row[25] === true,
      },
      createdAt: String(row[26] || new Date().toISOString()),
      updatedAt: String(row[27] || new Date().toISOString()),
    };
  }

  // Activity Log Mapper
  static activityToRow(activity: ActivityLogItem): (string | number | boolean)[] {
    return [
      activity.activityId,
      activity.timestamp,
      activity.contentId,
      activity.userId,
      activity.actionType,
      activity.previousStatus || '',
      activity.newStatus || '',
      activity.notes || '',
    ];
  }

  static rowToActivity(row: any[]): ActivityLogItem {
    return {
      activityId: Number(row[0]),
      timestamp: String(row[1]),
      contentId: Number(row[2]),
      userId: Number(row[3]),
      actionType: String(row[4]),
      previousStatus: String(row[5] || '') || undefined,
      newStatus: String(row[6] || '') || undefined,
      notes: String(row[7] || '') || undefined,
    };
  }

  // Series Mapper
  static seriesToRow(series: Series): (string | number | boolean)[] {
    return [series.seriesId, series.name, series.shortCode, series.active];
  }

  static rowToSeries(row: any[], defaultId: number = 1): Series {
    const parsedId = Number(row[0]);
    const seriesId = !isNaN(parsedId) && parsedId > 0 ? parsedId : defaultId;
    return {
      seriesId,
      name: String(row[1] || '').trim(),
      shortCode: String(row[2] || '').trim(),
      active: row[3] !== undefined && row[3] !== '' ? (String(row[3]).toLowerCase() === 'true' || row[3] === true) : true,
    };
  }

  // Sub-Series Mapper (Master Sub-Series Sheet: [subSeriesId, name, active])
  static subSeriesToRow(subSeries: SubSeries): (string | number | boolean)[] {
    return [subSeries.subSeriesId, subSeries.name, subSeries.active];
  }

  static rowToSubSeries(row: any[], defaultId: number = 1): SubSeries {
    const parsedId = Number(row[0]);
    const subSeriesId = !isNaN(parsedId) && parsedId > 0 ? parsedId : defaultId;
    
    // Support legacy 4-column format [subSeriesId, seriesId, name, active]
    const isLegacy = row.length >= 4 || typeof row[1] === 'number' || (!isNaN(Number(row[1])) && row[1] !== '' && row[1] !== true && row[1] !== false && String(row[1]).toLowerCase() !== 'true' && String(row[1]).toLowerCase() !== 'false' && row.length > 3);

    if (isLegacy && row[2] !== undefined) {
      return {
        subSeriesId,
        seriesId: Number(row[1]),
        name: String(row[2] || '').trim(),
        active: row[3] !== undefined && row[3] !== '' ? (String(row[3]).toLowerCase() === 'true' || row[3] === true) : true,
      };
    }

    return {
      subSeriesId,
      name: String(row[1] || '').trim(),
      active: row[2] !== undefined && row[2] !== '' ? (String(row[2]).toLowerCase() === 'true' || row[2] === true) : true,
    };
  }
}
