import { describe, it, expect } from 'vitest';
import { memoryRepository } from './repositories/memoryRepository';
import { PermissionService } from './auth/permissionService';
import { WorkflowEngine } from './services/workflowEngine';
import { NotificationService } from './services/notificationService';
import { ConfigValidator } from './config/configValidator';
import { appConfig } from './config/appConfig';
import { User } from './types/user';

describe('Phase 11 Testing Checklist Verification (docs/019)', () => {
  it('TC-01: Authentication & Authorization Checklist', async () => {
    const admin = (await memoryRepository.getUserByEmail('admin@infineo.com'))!;
    const manager = (await memoryRepository.getUserByEmail('manager@infineo.com'))!;
    const employee = (await memoryRepository.getUserByEmail('rahul@infineo.com'))!;

    expect(PermissionService.canManageUsers(admin)).toBe(true);
    expect(PermissionService.canApprove(manager)).toBe(true);
    expect(PermissionService.canApprove(employee)).toBe(false);
  });

  it('TC-02: Workflow Engine Transitions Checklist', async () => {
    const employee = (await memoryRepository.getUserByEmail('rahul@infineo.com'))!;
    const idea = await WorkflowEngine.createIdea(employee, {
      seriesId: 1,
      title: 'TC-02 Test Problem',
    });
    expect(idea.currentStatus).toBe('Idea Review (Manager)');
  });

  it('TC-03: Data Layer & Persistence Checklist', async () => {
    const users = await memoryRepository.getUsers();
    expect(users.length).toBeGreaterThan(0);
  });

  it('TC-04: Notifications Checklist', async () => {
    const employee = (await memoryRepository.getUserByEmail('rahul@infineo.com'))!;
    const manager = (await memoryRepository.getUserByEmail('manager@infineo.com'))!;
    const item = (await memoryRepository.getContentItems())[0];

    const email = NotificationService.generateEmailTemplate('STAGE_APPROVED', employee, item, manager);
    expect(email.recipientEmail).toBe(employee.email);
  });

  it('TC-05: Configuration Checklist', () => {
    expect(ConfigValidator.validate(appConfig)).toBe(true);
  });
});
