import { User } from '../types/user';
import { ContentItem } from '../types/content';

export class PermissionService {
  static canApprove(user?: User | null): boolean {
    if (!user || !user.active) return false;
    return user.role === 'Manager' || user.role === 'Admin';
  }

  static canFinalApprove(user?: User | null): boolean {
    if (!user || !user.active) return false;
    return user.role === 'Admin';
  }

  static canAssign(user?: User | null): boolean {
    if (!user || !user.active) return false;
    return user.role === 'Manager' || user.role === 'Admin';
  }

  static canSchedule(user?: User | null): boolean {
    if (!user || !user.active) return false;
    return user.role === 'Manager' || user.role === 'Admin';
  }

  static canMarkUploaded(user?: User | null): boolean {
    if (!user || !user.active) return false;
    return user.role === 'Manager' || user.role === 'Admin';
  }

  static canManageUsers(user?: User | null): boolean {
    if (!user || !user.active) return false;
    return user.role === 'Admin';
  }

  static canManageSettings(user?: User | null): boolean {
    if (!user || !user.active) return false;
    return user.role === 'Admin';
  }

  static canClaimWork(user?: User | null): boolean {
    if (!user || !user.active) return false;
    return true; // Employee, Manager, Admin can claim available work
  }

  static canEditContent(user?: User | null, item?: ContentItem): boolean {
    if (!user || !user.active || !item) return false;

    if (user.role === 'Admin') return true;

    if (user.role === 'Manager') {
      return item.currentStatus !== 'Completed' && item.currentStatus !== 'Uploaded';
    }

    if (user.role === 'Employee') {
      if (item.assignedUserId !== user.userId) return false;
      const editableStatuses = ['Idea', 'Script WIP', 'Reel WIP', 'Metadata Completion'];
      return editableStatuses.includes(item.currentStatus);
    }

    return false;
  }
}
