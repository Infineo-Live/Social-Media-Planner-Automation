import { describe, it, expect, beforeEach } from 'vitest';
import { WorkflowEngine } from './workflowEngine';
import { dataRepository } from '../repositories/dataRepository';
import { User } from '../types/user';
import { WorkflowError, ValidationError, PermissionError } from './errorFramework';

describe('Phase 5 Workflow Engine', () => {
  let admin: User;
  let manager: User;
  let employee: User;

  beforeEach(async () => {
    admin = (await dataRepository.getUserByEmail('admin@infineo.com'))!;
    manager = (await dataRepository.getUserByEmail('manager@infineo.com'))!;
    employee = (await dataRepository.getUserByEmail('rahul@infineo.com'))!;
  });

  it('executes complete end-to-end happy path workflow', async () => {
    // 1. Employee creates Idea
    const idea = await WorkflowEngine.createIdea(employee, {
      seriesId: 1,
      title: 'End-to-End Test Reel Title',
      mythologyStory: 'Gita chapter 2 summary',
    });
    expect(idea.currentStatus).toBe('Idea Review (Manager)');
    expect(idea.assignedUserId).toBe(manager.userId);

    // 2. Manager approves Idea -> Idea Review (Admin)
    const ideaAdmin = await WorkflowEngine.approveIdeaManager(manager, idea.contentId);
    expect(ideaAdmin.currentStatus).toBe('Idea Review (Admin)');
    expect(ideaAdmin.assignedUserId).toBe(admin.userId);

    // 3. Admin approves Idea -> Script WIP (Unassigned)
    const scriptWip = await WorkflowEngine.approveIdeaAdmin(admin, idea.contentId);
    expect(scriptWip.currentStatus).toBe('Script WIP');
    expect(scriptWip.assignedUserId).toBeUndefined();

    // 4. Employee claims Script
    const claimedScript = await WorkflowEngine.claimScript(employee, idea.contentId);
    expect(claimedScript.assignedUserId).toBe(employee.userId);

    // 5. Employee submits Script -> Script Review (Manager)
    const scriptManager = await WorkflowEngine.submitScript(employee, idea.contentId);
    expect(scriptManager.currentStatus).toBe('Script Review (Manager)');
    expect(scriptManager.assignedUserId).toBe(manager.userId);

    // 6. Manager approves Script -> Script Review (Admin)
    const scriptAdmin = await WorkflowEngine.approveScriptManager(manager, idea.contentId);
    expect(scriptAdmin.currentStatus).toBe('Script Review (Admin)');

    // 7. Admin approves Script -> Reel WIP (Unassigned)
    const reelWip = await WorkflowEngine.approveScriptAdmin(admin, idea.contentId);
    expect(reelWip.currentStatus).toBe('Reel WIP');
    expect(reelWip.assignedUserId).toBeUndefined();

    // 8. Employee claims Reel
    const claimedReel = await WorkflowEngine.claimReel(employee, idea.contentId);
    expect(claimedReel.assignedUserId).toBe(employee.userId);

    // 9. Employee submits Reel with valid Canva link
    const reelManager = await WorkflowEngine.submitReel(
      employee,
      idea.contentId,
      'https://canva.com/design/E2E_Test'
    );
    expect(reelManager.currentStatus).toBe('Reel Review (Manager)');
    expect(reelManager.currentCanvaLink).toBe('https://canva.com/design/E2E_Test');

    // 10. Manager approves Reel -> Reel Review (Admin)
    const reelAdmin = await WorkflowEngine.approveReelManager(manager, idea.contentId);
    expect(reelAdmin.currentStatus).toBe('Reel Review (Admin)');

    // 11. Admin approves Reel -> Metadata Completion (Assigned to Reel Creator)
    const metadataStage = await WorkflowEngine.approveReelAdmin(admin, idea.contentId);
    expect(metadataStage.currentStatus).toBe('Metadata Completion');
    expect(metadataStage.assignedUserId).toBe(employee.userId);

    // 12. Employee completes all metadata -> Completed
    const completedItem = await WorkflowEngine.completeMetadata(employee, idea.contentId, {
      youtubeTitle: 'YT Title E2E',
      youtubeDescription: 'YT Desc E2E',
      youtubeTags: 'tag1, tag2',
      instagramCaption: 'Insta Caption E2E',
      instagramPoll: 'Poll Question E2E',
      linkedInCaption: 'LinkedIn Caption E2E',
      twitterCaption: 'Twitter Caption E2E',
    });
    expect(completedItem.currentStatus).toBe('Completed');
    expect(completedItem.assignedUserId).toBeUndefined();

    // 13. Manager schedules content with Episode Number
    const scheduledItem = await WorkflowEngine.updateScheduling(manager, idea.contentId, 100, {
      YouTube: true,
      Instagram: true,
      LinkedIn: false,
      Twitter: false,
    });
    expect(scheduledItem.currentStatus).toBe('Scheduled');
    expect(scheduledItem.episodeNumber).toBe(100);
    expect(scheduledItem.scheduled.YouTube).toBe(true);

    // 14. Manager uploads content
    const uploadedItem = await WorkflowEngine.updateUploads(manager, idea.contentId, {
      YouTube: true,
      Instagram: true,
      LinkedIn: false,
      Twitter: false,
    });
    expect(uploadedItem.currentStatus).toBe('Uploaded');
    expect(uploadedItem.uploaded.YouTube).toBe(true);

    // Verify activity logs recorded
    const logs = await dataRepository.getActivityLogs(idea.contentId);
    expect(logs.length).toBeGreaterThanOrEqual(10);
  });

  it('validates rejection workflow routing', async () => {
    // Create Idea
    const idea = await WorkflowEngine.createIdea(employee, {
      seriesId: 1,
      title: 'Rejection test problem title',
    });

    // Manager rejects Idea -> returns to creator
    const rejectedIdea = await WorkflowEngine.rejectIdeaManager(
      manager,
      idea.contentId,
      'Needs more details in problem description.'
    );
    expect(rejectedIdea.currentStatus).toBe('Idea');
    expect(rejectedIdea.assignedUserId).toBe(employee.userId);
  });

  it('blocks submitting reel without valid Canva URL', async () => {
    const item = await dataRepository.createContentItem({
      seriesId: 1,
      title: 'Canva validation test',
      currentStatus: 'Reel WIP',
      assignedUserId: employee.userId,
      createdByUserId: employee.userId,
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
      WorkflowEngine.submitReel(employee, item.contentId, 'invalid-link')
    ).rejects.toThrow(ValidationError);
  });

  it('blocks employee from performing Manager/Admin actions', async () => {
    const item = await dataRepository.createContentItem({
      seriesId: 1,
      title: 'Permission test',
      currentStatus: 'Idea Review (Manager)',
      assignedUserId: manager.userId,
      createdByUserId: employee.userId,
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

    await expect(WorkflowEngine.approveIdeaManager(employee, item.contentId)).rejects.toThrow(
      PermissionError
    );
  });
});
