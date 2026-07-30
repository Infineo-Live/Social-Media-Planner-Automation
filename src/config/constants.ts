import { WorkflowStatus, Platform } from '../types/content';
import { UserRole } from '../types/user';

export const WORKFLOW_STATUSES: WorkflowStatus[] = [
  'Idea',
  'Idea Review (Manager)',
  'Idea Review (Admin)',
  'Script WIP',
  'Script Review (Manager)',
  'Script Review (Admin)',
  'Reel WIP',
  'Reel Review (Manager)',
  'Reel Review (Admin)',
  'Metadata Completion',
  'Completed',
  'Scheduled',
  'Uploaded',
];

export const PLATFORMS: Platform[] = ['YouTube', 'Instagram', 'LinkedIn', 'Twitter'];

export const USER_ROLES: UserRole[] = ['Admin', 'Manager', 'Employee'];

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  MY_TASKS: '/my-tasks',
  AVAILABLE_WORK: '/available-work',
  APPROVALS: '/approvals',
  CONTENT_LIBRARY: '/content',
  CONTENT_CREATE: '/content/new',
  CONTENT_DETAIL: '/content/:id',
  NOTIFICATIONS: '/notifications',
  TEAM_OVERVIEW: '/team',
  USERS: '/users',
  SETTINGS: '/settings',
  PROFILE: '/profile',
};
