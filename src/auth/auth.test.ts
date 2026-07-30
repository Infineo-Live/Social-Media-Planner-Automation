import { describe, it, expect, beforeEach } from 'vitest';
import { memoryRepository } from '../repositories/memoryRepository';
import { PermissionService } from './permissionService';
import { User, UserRole } from '../types/user';
import { ContentItem } from '../types/content';

describe('Phase 3 Authentication & Authorization', () => {
  let adminUser: User;
  let managerUser: User;
  let employeeUser: User;

  beforeEach(async () => {
    adminUser = (await memoryRepository.getUserByEmail('admin@infineo.com'))!;
    managerUser = (await memoryRepository.getUserByEmail('manager@infineo.com'))!;
    employeeUser = (await memoryRepository.getUserByEmail('rahul@infineo.com'))!;
  });

  it('validates seed user roles and credentials', () => {
    expect(adminUser.role).toBe('Admin');
    expect(managerUser.role).toBe('Manager');
    expect(employeeUser.role).toBe('Employee');
    expect(adminUser.active).toBe(true);
  });

  it('blocks login for non-existent users', async () => {
    const unknown = await memoryRepository.getUserByEmail('unknown@infineo.com');
    expect(unknown).toBeUndefined();
  });

  it('blocks inactive users from permission checks', async () => {
    const inactiveUser: User = {
      userId: 99,
      fullName: 'Inactive Person',
      email: 'inactive@infineo.com',
      role: 'Employee',
      active: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(PermissionService.canApprove(inactiveUser)).toBe(false);
    expect(PermissionService.canManageUsers(inactiveUser)).toBe(false);
  });

  it('enforces role-based permissions matrix', () => {
    // Admin permissions
    expect(PermissionService.canManageUsers(adminUser)).toBe(true);
    expect(PermissionService.canManageSettings(adminUser)).toBe(true);
    expect(PermissionService.canFinalApprove(adminUser)).toBe(true);

    // Manager permissions
    expect(PermissionService.canApprove(managerUser)).toBe(true);
    expect(PermissionService.canAssign(managerUser)).toBe(true);
    expect(PermissionService.canSchedule(managerUser)).toBe(true);
    expect(PermissionService.canFinalApprove(managerUser)).toBe(false);
    expect(PermissionService.canManageUsers(managerUser)).toBe(false);

    // Employee permissions
    expect(PermissionService.canApprove(employeeUser)).toBe(false);
    expect(PermissionService.canAssign(employeeUser)).toBe(false);
    expect(PermissionService.canSchedule(employeeUser)).toBe(false);
    expect(PermissionService.canManageUsers(employeeUser)).toBe(false);
  });

  it('enforces editing permissions for ContentItems', () => {
    const testItem: ContentItem = {
      contentId: 200,
      seriesId: 1,
      workingTitle: 'Test Reel',
      realLifeProblem: 'Test problem',
      currentStatus: 'Script WIP',
      assignedUserId: employeeUser.userId,
      createdByUserId: employeeUser.userId,
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Assigned employee can edit during Script WIP
    expect(PermissionService.canEditContent(employeeUser, testItem)).toBe(true);

    // Unassigned employee cannot edit
    const otherEmployee: User = { ...employeeUser, userId: 88 };
    expect(PermissionService.canEditContent(otherEmployee, testItem)).toBe(false);

    // Admin can always edit
    expect(PermissionService.canEditContent(adminUser, testItem)).toBe(true);
  });
});
