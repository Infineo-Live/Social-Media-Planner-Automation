import { User } from '../types/user';
import { ContentItem, PlatformChecklist, PublishingMetadata, WorkflowStatus } from '../types/content';
import { dataRepository } from '../repositories/dataRepository';
import { PermissionService } from '../auth/permissionService';
import { WorkflowError, ValidationError, PermissionError } from './errorFramework';
import { isValidUrl, isNonEmptyString } from '../utils/validationUtils';
import { logger } from './logger';
import { NotificationService } from './notificationService';

export class WorkflowEngine {
  // Helper to find a default Manager or Admin user for automatic routing
  private static async getManagerUserId(): Promise<number> {
    const users = await dataRepository.getUsers();
    const manager = users.find((u) => u.role === 'Manager' && u.active);
    return manager ? manager.userId : 2;
  }

  private static async getAdminUserId(): Promise<number> {
    const users = await dataRepository.getUsers();
    const admin = users.find((u) => u.role === 'Admin' && u.active);
    return admin ? admin.userId : 1;
  }

  // 1. Create Idea
  static async createIdea(
    user: User,
    data: {
      seriesId: number;
      subSeriesId?: number;
      title: string;
      plannedUploadDate?: string;
      mythologyStory?: string;
    }
  ): Promise<ContentItem> {
    if (!user || !user.active) throw new PermissionError('Inactive or missing user.');
    if (!data.seriesId) throw new ValidationError('Series is required.');
    if (!isNonEmptyString(data.title)) {
      throw new ValidationError('Title is required.');
    }

    const managerId = await this.getManagerUserId();

    const newContent = await dataRepository.createContentItem({
      seriesId: data.seriesId,
      subSeriesId: data.subSeriesId,
      title: data.title,
      plannedUploadDate: data.plannedUploadDate,
      mythologyStory: data.mythologyStory,
      currentStatus: 'Idea Review (Manager)',
      assignedUserId: managerId,
      createdByUserId: user.userId,
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

    await dataRepository.logActivity({
      contentId: newContent.contentId,
      userId: user.userId,
      actionType: 'Idea Created',
      previousStatus: undefined,
      newStatus: 'Idea Review (Manager)',
      notes: `Idea created by ${user.fullName} and assigned to Manager.`,
    });

    logger.info(`Idea #${newContent.contentId} created by user #${user.userId}`);
    return newContent;
  }

  // 2. Manager Approve Idea
  static async approveIdeaManager(user: User, contentId: number): Promise<ContentItem> {
    if (!PermissionService.canApprove(user)) {
      throw new PermissionError('Only Manager or Admin can approve ideas.');
    }

    const item = await dataRepository.getContentItemById(contentId);
    if (!item) throw new ValidationError(`Content Item #${contentId} not found.`);
    if (item.currentStatus !== 'Idea Review (Manager)' && item.currentStatus !== 'Idea') {
      throw new WorkflowError(`Cannot approve idea in status '${item.currentStatus}'.`);
    }

    const adminId = await this.getAdminUserId();
    const updated = await dataRepository.updateContentItem(contentId, {
      currentStatus: 'Idea Review (Admin)',
      assignedUserId: adminId,
    });

    await dataRepository.logActivity({
      contentId,
      userId: user.userId,
      actionType: 'Idea Approved (Manager)',
      previousStatus: item.currentStatus,
      newStatus: 'Idea Review (Admin)',
    });

    return updated;
  }

  // 3. Manager Reject Idea
  static async rejectIdeaManager(user: User, contentId: number, reason: string): Promise<ContentItem> {
    if (!PermissionService.canApprove(user)) {
      throw new PermissionError('Only Manager or Admin can reject ideas.');
    }
    if (!isNonEmptyString(reason)) throw new ValidationError('Rejection reason is required.');

    const item = await dataRepository.getContentItemById(contentId);
    if (!item) throw new ValidationError(`Content Item #${contentId} not found.`);

    const updated = await dataRepository.updateContentItem(contentId, {
      currentStatus: 'Idea',
      assignedUserId: item.createdByUserId,
    });

    await dataRepository.logActivity({
      contentId,
      userId: user.userId,
      actionType: 'Idea Rejected (Manager)',
      previousStatus: item.currentStatus,
      newStatus: 'Idea',
      notes: reason,
    });

    return updated;
  }

  // 4. Admin Approve Idea
  static async approveIdeaAdmin(user: User, contentId: number): Promise<ContentItem> {
    if (!PermissionService.canFinalApprove(user)) {
      throw new PermissionError('Only Admin can perform final idea approval.');
    }

    const item = await dataRepository.getContentItemById(contentId);
    if (!item) throw new ValidationError(`Content Item #${contentId} not found.`);
    if (item.currentStatus !== 'Idea Review (Admin)') {
      throw new WorkflowError(`Cannot final approve idea in status '${item.currentStatus}'.`);
    }

    const updated = await dataRepository.updateContentItem(contentId, {
      currentStatus: 'Script WIP',
      assignedUserId: undefined, // Available to claim
    });

    await dataRepository.logActivity({
      contentId,
      userId: user.userId,
      actionType: 'Idea Approved (Admin)',
      previousStatus: item.currentStatus,
      newStatus: 'Script WIP',
    });

    return updated;
  }

  // 5. Admin Reject Idea
  static async rejectIdeaAdmin(user: User, contentId: number, reason: string): Promise<ContentItem> {
    if (!PermissionService.canFinalApprove(user)) {
      throw new PermissionError('Only Admin can perform final idea rejection.');
    }
    if (!isNonEmptyString(reason)) throw new ValidationError('Rejection reason is required.');

    const item = await dataRepository.getContentItemById(contentId);
    if (!item) throw new ValidationError(`Content Item #${contentId} not found.`);

    const updated = await dataRepository.updateContentItem(contentId, {
      currentStatus: 'Idea',
      assignedUserId: item.createdByUserId,
    });

    await dataRepository.logActivity({
      contentId,
      userId: user.userId,
      actionType: 'Idea Rejected (Admin)',
      previousStatus: item.currentStatus,
      newStatus: 'Idea',
      notes: reason,
    });

    return updated;
  }

  // 6. Claim Script
  static async claimScript(user: User, contentId: number): Promise<ContentItem> {
    if (!user || !user.active) throw new PermissionError('Inactive user.');
    const item = await dataRepository.getContentItemById(contentId);
    if (!item) throw new ValidationError(`Content Item #${contentId} not found.`);

    if (item.currentStatus !== 'Script WIP') {
      throw new WorkflowError(`Content Item #${contentId} is not in 'Script WIP' stage.`);
    }
    if (item.assignedUserId && item.assignedUserId !== user.userId) {
      throw new WorkflowError(`Task #${contentId} is already claimed by another user.`);
    }

    const updated = await dataRepository.updateContentItem(contentId, {
      assignedUserId: user.userId,
    });

    await dataRepository.logActivity({
      contentId,
      userId: user.userId,
      actionType: 'Script Claimed',
      previousStatus: item.currentStatus,
      newStatus: item.currentStatus,
      notes: `Claimed by ${user.fullName}`,
    });

    return updated;
  }

  // 7. Submit Script
  static async submitScript(user: User, contentId: number): Promise<ContentItem> {
    const item = await dataRepository.getContentItemById(contentId);
    if (!item) throw new ValidationError(`Content Item #${contentId} not found.`);
    if (item.currentStatus !== 'Script WIP') {
      throw new WorkflowError(`Cannot submit script in status '${item.currentStatus}'.`);
    }

    if (!PermissionService.canEditContent(user, item)) {
      throw new PermissionError('You are not authorized to submit this script.');
    }

    const managerId = await this.getManagerUserId();
    const updated = await dataRepository.updateContentItem(contentId, {
      currentStatus: 'Script Review (Manager)',
      assignedUserId: managerId,
    });

    await dataRepository.logActivity({
      contentId,
      userId: user.userId,
      actionType: 'Script Submitted',
      previousStatus: 'Script WIP',
      newStatus: 'Script Review (Manager)',
    });

    return updated;
  }

  // 8. Manager Approve Script
  static async approveScriptManager(user: User, contentId: number): Promise<ContentItem> {
    if (!PermissionService.canApprove(user)) {
      throw new PermissionError('Only Manager or Admin can approve scripts.');
    }

    const item = await dataRepository.getContentItemById(contentId);
    if (!item) throw new ValidationError(`Content Item #${contentId} not found.`);
    if (item.currentStatus !== 'Script Review (Manager)') {
      throw new WorkflowError(`Cannot approve script in status '${item.currentStatus}'.`);
    }

    const adminId = await this.getAdminUserId();
    const updated = await dataRepository.updateContentItem(contentId, {
      currentStatus: 'Script Review (Admin)',
      assignedUserId: adminId,
    });

    await dataRepository.logActivity({
      contentId,
      userId: user.userId,
      actionType: 'Script Approved (Manager)',
      previousStatus: item.currentStatus,
      newStatus: 'Script Review (Admin)',
    });

    return updated;
  }

  // 9. Manager Reject Script
  static async rejectScriptManager(user: User, contentId: number, reason: string): Promise<ContentItem> {
    if (!PermissionService.canApprove(user)) {
      throw new PermissionError('Only Manager or Admin can reject scripts.');
    }
    if (!isNonEmptyString(reason)) throw new ValidationError('Rejection reason is required.');

    const item = await dataRepository.getContentItemById(contentId);
    if (!item) throw new ValidationError(`Content Item #${contentId} not found.`);

    // Find previous script writer from activity logs or assignedUserId
    const logs = await dataRepository.getActivityLogs(contentId);
    const claimLog = logs.find((l) => l.actionType === 'Script Claimed' || l.actionType === 'Script Submitted');
    const targetUserId = claimLog ? claimLog.userId : item.assignedUserId || item.createdByUserId;

    const updated = await dataRepository.updateContentItem(contentId, {
      currentStatus: 'Script WIP',
      assignedUserId: targetUserId,
    });

    await dataRepository.logActivity({
      contentId,
      userId: user.userId,
      actionType: 'Script Rejected (Manager)',
      previousStatus: item.currentStatus,
      newStatus: 'Script WIP',
      notes: reason,
    });

    return updated;
  }

  // 10. Admin Approve Script
  static async approveScriptAdmin(user: User, contentId: number): Promise<ContentItem> {
    if (!PermissionService.canFinalApprove(user)) {
      throw new PermissionError('Only Admin can perform final script approval.');
    }

    const item = await dataRepository.getContentItemById(contentId);
    if (!item) throw new ValidationError(`Content Item #${contentId} not found.`);
    if (item.currentStatus !== 'Script Review (Admin)') {
      throw new WorkflowError(`Cannot final approve script in status '${item.currentStatus}'.`);
    }

    const updated = await dataRepository.updateContentItem(contentId, {
      currentStatus: 'Reel WIP',
      assignedUserId: undefined, // Available to claim for Reel creation
    });

    await dataRepository.logActivity({
      contentId,
      userId: user.userId,
      actionType: 'Script Approved (Admin)',
      previousStatus: item.currentStatus,
      newStatus: 'Reel WIP',
    });

    return updated;
  }

  // 11. Admin Reject Script
  static async rejectScriptAdmin(user: User, contentId: number, reason: string): Promise<ContentItem> {
    if (!PermissionService.canFinalApprove(user)) {
      throw new PermissionError('Only Admin can perform final script rejection.');
    }
    if (!isNonEmptyString(reason)) throw new ValidationError('Rejection reason is required.');

    const item = await dataRepository.getContentItemById(contentId);
    if (!item) throw new ValidationError(`Content Item #${contentId} not found.`);

    const logs = await dataRepository.getActivityLogs(contentId);
    const claimLog = logs.find((l) => l.actionType === 'Script Claimed' || l.actionType === 'Script Submitted');
    const targetUserId = claimLog ? claimLog.userId : item.assignedUserId || item.createdByUserId;

    const updated = await dataRepository.updateContentItem(contentId, {
      currentStatus: 'Script WIP',
      assignedUserId: targetUserId,
    });

    await dataRepository.logActivity({
      contentId,
      userId: user.userId,
      actionType: 'Script Rejected (Admin)',
      previousStatus: item.currentStatus,
      newStatus: 'Script WIP',
      notes: reason,
    });

    return updated;
  }

  // 12. Claim Reel
  static async claimReel(user: User, contentId: number): Promise<ContentItem> {
    if (!user || !user.active) throw new PermissionError('Inactive user.');
    const item = await dataRepository.getContentItemById(contentId);
    if (!item) throw new ValidationError(`Content Item #${contentId} not found.`);

    if (item.currentStatus !== 'Reel WIP') {
      throw new WorkflowError(`Content Item #${contentId} is not in 'Reel WIP' stage.`);
    }
    if (item.assignedUserId && item.assignedUserId !== user.userId) {
      throw new WorkflowError(`Reel #${contentId} is already claimed by another user.`);
    }

    const updated = await dataRepository.updateContentItem(contentId, {
      assignedUserId: user.userId,
    });

    await dataRepository.logActivity({
      contentId,
      userId: user.userId,
      actionType: 'Reel Claimed',
      previousStatus: item.currentStatus,
      newStatus: item.currentStatus,
      notes: `Claimed by ${user.fullName}`,
    });

    return updated;
  }

  // 13. Submit Reel
  static async submitReel(user: User, contentId: number, canvaLink: string): Promise<ContentItem> {
    const item = await dataRepository.getContentItemById(contentId);
    if (!item) throw new ValidationError(`Content Item #${contentId} not found.`);
    if (item.currentStatus !== 'Reel WIP') {
      throw new WorkflowError(`Cannot submit reel in status '${item.currentStatus}'.`);
    }

    if (!isValidUrl(canvaLink)) {
      throw new ValidationError('A valid Canva link (HTTPS URL) is required before submitting a reel.');
    }

    if (!PermissionService.canEditContent(user, item)) {
      throw new PermissionError('You are not authorized to submit this reel.');
    }

    const managerId = await this.getManagerUserId();
    const updated = await dataRepository.updateContentItem(contentId, {
      currentCanvaLink: canvaLink.trim(),
      currentStatus: 'Reel Review (Manager)',
      assignedUserId: managerId,
    });

    await dataRepository.logActivity({
      contentId,
      userId: user.userId,
      actionType: 'Reel Submitted',
      previousStatus: 'Reel WIP',
      newStatus: 'Reel Review (Manager)',
      notes: `Canva Link: ${canvaLink.trim()}`,
    });

    return updated;
  }

  // 14. Manager Approve Reel
  static async approveReelManager(user: User, contentId: number): Promise<ContentItem> {
    if (!PermissionService.canApprove(user)) {
      throw new PermissionError('Only Manager or Admin can approve reels.');
    }

    const item = await dataRepository.getContentItemById(contentId);
    if (!item) throw new ValidationError(`Content Item #${contentId} not found.`);
    if (item.currentStatus !== 'Reel Review (Manager)') {
      throw new WorkflowError(`Cannot approve reel in status '${item.currentStatus}'.`);
    }

    const adminId = await this.getAdminUserId();
    const updated = await dataRepository.updateContentItem(contentId, {
      currentStatus: 'Reel Review (Admin)',
      assignedUserId: adminId,
    });

    await dataRepository.logActivity({
      contentId,
      userId: user.userId,
      actionType: 'Reel Approved (Manager)',
      previousStatus: item.currentStatus,
      newStatus: 'Reel Review (Admin)',
    });

    return updated;
  }

  // 15. Manager Reject Reel
  static async rejectReelManager(user: User, contentId: number, reason: string): Promise<ContentItem> {
    if (!PermissionService.canApprove(user)) {
      throw new PermissionError('Only Manager or Admin can reject reels.');
    }
    if (!isNonEmptyString(reason)) throw new ValidationError('Rejection reason is required.');

    const item = await dataRepository.getContentItemById(contentId);
    if (!item) throw new ValidationError(`Content Item #${contentId} not found.`);

    const logs = await dataRepository.getActivityLogs(contentId);
    const reelLog = logs.find((l) => l.actionType === 'Reel Claimed' || l.actionType === 'Reel Submitted');
    const targetUserId = reelLog ? reelLog.userId : item.assignedUserId || item.createdByUserId;

    const updated = await dataRepository.updateContentItem(contentId, {
      currentStatus: 'Reel WIP',
      assignedUserId: targetUserId,
    });

    await dataRepository.logActivity({
      contentId,
      userId: user.userId,
      actionType: 'Reel Rejected (Manager)',
      previousStatus: item.currentStatus,
      newStatus: 'Reel WIP',
      notes: reason,
    });

    return updated;
  }

  // 16. Admin Approve Reel
  static async approveReelAdmin(user: User, contentId: number): Promise<ContentItem> {
    if (!PermissionService.canFinalApprove(user)) {
      throw new PermissionError('Only Admin can perform final reel approval.');
    }

    const item = await dataRepository.getContentItemById(contentId);
    if (!item) throw new ValidationError(`Content Item #${contentId} not found.`);
    if (item.currentStatus !== 'Reel Review (Admin)') {
      throw new WorkflowError(`Cannot final approve reel in status '${item.currentStatus}'.`);
    }

    // Find the reel editor (employee who created/submitted the reel)
    const logs = await dataRepository.getActivityLogs(contentId);
    const reelSubmitLog = logs.find((l) => l.actionType === 'Reel Submitted');
    const reelCreatorId = reelSubmitLog ? reelSubmitLog.userId : item.createdByUserId;

    const updated = await dataRepository.updateContentItem(contentId, {
      currentStatus: 'Metadata Completion',
      assignedUserId: reelCreatorId, // Automatically routes back to reel creator for metadata
    });

    await dataRepository.logActivity({
      contentId,
      userId: user.userId,
      actionType: 'Reel Approved (Admin)',
      previousStatus: item.currentStatus,
      newStatus: 'Metadata Completion',
    });

    return updated;
  }

  // 17. Admin Reject Reel
  static async rejectReelAdmin(user: User, contentId: number, reason: string): Promise<ContentItem> {
    if (!PermissionService.canFinalApprove(user)) {
      throw new PermissionError('Only Admin can perform final reel rejection.');
    }
    if (!isNonEmptyString(reason)) throw new ValidationError('Rejection reason is required.');

    const item = await dataRepository.getContentItemById(contentId);
    if (!item) throw new ValidationError(`Content Item #${contentId} not found.`);

    const logs = await dataRepository.getActivityLogs(contentId);
    const reelLog = logs.find((l) => l.actionType === 'Reel Claimed' || l.actionType === 'Reel Submitted');
    const targetUserId = reelLog ? reelLog.userId : item.assignedUserId || item.createdByUserId;

    const updated = await dataRepository.updateContentItem(contentId, {
      currentStatus: 'Reel WIP',
      assignedUserId: targetUserId,
    });

    await dataRepository.logActivity({
      contentId,
      userId: user.userId,
      actionType: 'Reel Rejected (Admin)',
      previousStatus: item.currentStatus,
      newStatus: 'Reel WIP',
      notes: reason,
    });

    return updated;
  }

  // 18. Complete Metadata
  static async completeMetadata(
    user: User,
    contentId: number,
    metadata: PublishingMetadata
  ): Promise<ContentItem> {
    const item = await dataRepository.getContentItemById(contentId);
    if (!item) throw new ValidationError(`Content Item #${contentId} not found.`);
    if (item.currentStatus !== 'Metadata Completion') {
      throw new WorkflowError(`Cannot complete metadata in status '${item.currentStatus}'.`);
    }

    if (!PermissionService.canEditContent(user, item)) {
      throw new PermissionError('You are not authorized to complete metadata for this item.');
    }

    // Validate mandatory metadata fields per doc 006 section 4.10
    const requiredKeys: (keyof PublishingMetadata)[] = [
      'youtubeTitle',
      'youtubeDescription',
      'youtubeTags',
      'instagramCaption',
      'instagramPoll',
      'linkedInCaption',
      'twitterCaption',
    ];

    const missingKeys = requiredKeys.filter((key) => !isNonEmptyString(metadata[key]));
    if (missingKeys.length > 0) {
      throw new ValidationError(
        `All publishing metadata fields are mandatory. Missing: ${missingKeys.join(', ')}`
      );
    }

    const updated = await dataRepository.updateContentItem(contentId, {
      metadata: { ...metadata },
      currentStatus: 'Completed',
      assignedUserId: undefined, // Assignment cleared
    });

    await dataRepository.logActivity({
      contentId,
      userId: user.userId,
      actionType: 'Metadata Completed',
      previousStatus: 'Metadata Completion',
      newStatus: 'Completed',
    });

    return updated;
  }

  // 19. Update Scheduling
  static async updateScheduling(
    user: User,
    contentId: number,
    episodeNumber: number,
    scheduledChecklist: PlatformChecklist
  ): Promise<ContentItem> {
    if (!PermissionService.canSchedule(user)) {
      throw new PermissionError('Only Manager or Admin can schedule content.');
    }

    const item = await dataRepository.getContentItemById(contentId);
    if (!item) throw new ValidationError(`Content Item #${contentId} not found.`);

    if (
      item.currentStatus !== 'Completed' &&
      item.currentStatus !== 'Scheduled' &&
      item.currentStatus !== 'Uploaded'
    ) {
      throw new WorkflowError(`Cannot schedule content in status '${item.currentStatus}'.`);
    }

    if (!episodeNumber || episodeNumber <= 0) {
      throw new ValidationError('A valid Episode Number is required when scheduling content.');
    }

    const hasAnyScheduled = Object.values(scheduledChecklist).some(Boolean);
    const newStatus: WorkflowStatus = hasAnyScheduled ? 'Scheduled' : item.currentStatus;

    const updated = await dataRepository.updateContentItem(contentId, {
      episodeNumber,
      scheduled: { ...scheduledChecklist },
      currentStatus: newStatus,
    });

    await dataRepository.logActivity({
      contentId,
      userId: user.userId,
      actionType: 'Content Scheduled',
      previousStatus: item.currentStatus,
      newStatus,
      notes: `Episode ${episodeNumber} scheduled on: ${Object.entries(scheduledChecklist)
        .filter(([, val]) => val)
        .map(([k]) => k)
        .join(', ')}`,
    });

    return updated;
  }

  // 20. Update Uploads
  static async updateUploads(
    user: User,
    contentId: number,
    uploadedChecklist: PlatformChecklist
  ): Promise<ContentItem> {
    if (!PermissionService.canMarkUploaded(user)) {
      throw new PermissionError('Only Manager or Admin can mark content as uploaded.');
    }

    const item = await dataRepository.getContentItemById(contentId);
    if (!item) throw new ValidationError(`Content Item #${contentId} not found.`);

    if (item.currentStatus !== 'Scheduled' && item.currentStatus !== 'Uploaded') {
      throw new WorkflowError(`Cannot mark upload in status '${item.currentStatus}'.`);
    }

    const hasAnyUploaded = Object.values(uploadedChecklist).some(Boolean);
    const newStatus: WorkflowStatus = hasAnyUploaded ? 'Uploaded' : item.currentStatus;

    const updated = await dataRepository.updateContentItem(contentId, {
      uploaded: { ...uploadedChecklist },
      currentStatus: newStatus,
    });

    await dataRepository.logActivity({
      contentId,
      userId: user.userId,
      actionType: 'Content Uploaded',
      previousStatus: item.currentStatus,
      newStatus,
      notes: `Uploaded to: ${Object.entries(uploadedChecklist)
        .filter(([, val]) => val)
        .map(([k]) => k)
        .join(', ')}`,
    });

    return updated;
  }

  // 21. Manual Assignment
  static async manualAssign(user: User, contentId: number, targetUserId: number): Promise<ContentItem> {
    if (!PermissionService.canAssign(user)) {
      throw new PermissionError('Only Manager or Admin can manually assign tasks.');
    }

    const item = await dataRepository.getContentItemById(contentId);
    if (!item) throw new ValidationError(`Content Item #${contentId} not found.`);

    let targetUser: User | undefined;
    if (targetUserId && targetUserId > 0) {
      targetUser = await dataRepository.getUserById(targetUserId);
      if (!targetUser || !targetUser.active) {
        throw new ValidationError('Target user does not exist or is inactive.');
      }
    }

    const updated = await dataRepository.updateContentItem(contentId, {
      assignedUserId: targetUserId && targetUserId > 0 ? targetUserId : undefined,
    });

    const notes = targetUser
      ? `Reassigned to ${targetUser.fullName} by ${user.fullName}`
      : `Unassigned by ${user.fullName}`;

    await dataRepository.logActivity({
      contentId,
      userId: user.userId,
      actionType: 'Task Reassigned',
      previousStatus: item.currentStatus,
      newStatus: item.currentStatus,
      notes,
    });

    if (targetUser && targetUserId > 0) {
      try {
        await NotificationService.createNotification(
          targetUserId,
          contentId,
          'Task Assigned',
          `You have been assigned task #${contentId} by ${user.fullName}.`
        );
        const emailMsg = NotificationService.generateEmailTemplate('TASK_ASSIGNED', targetUser, updated, user);
        await NotificationService.sendEmailNotification(emailMsg);
      } catch (err) {
        logger.error('Failed to dispatch assignment notification', { error: err });
      }
    }

    return updated;
  }
}

