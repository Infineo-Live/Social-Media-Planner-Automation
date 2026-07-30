import { ContentItem } from '../types/content';
import { User } from '../types/user';
import { dataRepository } from '../repositories/dataRepository';
import { PermissionService } from '../auth/permissionService';
import { ValidationError, PermissionError } from './errorFramework';

export interface ContentFilterCriteria {
  searchTerm?: string;
  seriesId?: number;
  subSeriesId?: number;
  status?: string;
  assignedUserId?: number;
  createdByUserId?: number;
  scheduledPlatform?: string;
  uploadedPlatform?: string;
}

export class BusinessFeaturesService {
  // Search & Filter Business Feature
  static filterContentItems(items: ContentItem[], criteria: ContentFilterCriteria): ContentItem[] {
    return items.filter((item) => {
      if (criteria.searchTerm) {
        const term = criteria.searchTerm.toLowerCase();
        const matchesTitle = item.workingTitle?.toLowerCase().includes(term);
        const matchesProblem = item.realLifeProblem.toLowerCase().includes(term);
        const matchesStory = item.mythologyStory?.toLowerCase().includes(term);
        const matchesCanva = item.currentCanvaLink?.toLowerCase().includes(term);
        if (!matchesTitle && !matchesProblem && !matchesStory && !matchesCanva) {
          return false;
        }
      }

      if (criteria.seriesId && item.seriesId !== criteria.seriesId) return false;
      if (criteria.subSeriesId && item.subSeriesId !== criteria.subSeriesId) return false;
      if (criteria.status && item.currentStatus !== criteria.status) return false;
      if (criteria.assignedUserId && item.assignedUserId !== criteria.assignedUserId) return false;
      if (criteria.createdByUserId && item.createdByUserId !== criteria.createdByUserId) return false;

      if (criteria.scheduledPlatform) {
        const key = criteria.scheduledPlatform as keyof typeof item.scheduled;
        if (!item.scheduled[key]) return false;
      }

      if (criteria.uploadedPlatform) {
        const key = criteria.uploadedPlatform as keyof typeof item.uploaded;
        if (!item.uploaded[key]) return false;
      }

      return true;
    });
  }

  // Bulk Reassignment Business Feature (Admin/Manager)
  static async bulkReassign(
    user: User,
    contentIds: number[],
    targetUserId: number
  ): Promise<number> {
    if (!PermissionService.canAssign(user)) {
      throw new PermissionError('Only Manager or Admin can perform bulk assignment.');
    }

    let successCount = 0;
    for (const id of contentIds) {
      const item = await dataRepository.getContentItemById(id);
      if (item) {
        await dataRepository.updateContentItem(id, { assignedUserId: targetUserId });
        await dataRepository.logActivity({
          contentId: id,
          userId: user.userId,
          actionType: 'Bulk Reassigned',
          previousStatus: item.currentStatus,
          newStatus: item.currentStatus,
          notes: `Bulk reassigned to User #${targetUserId}`,
        });
        successCount++;
      }
    }
    return successCount;
  }
}
