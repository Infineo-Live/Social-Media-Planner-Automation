import { describe, it, expect } from 'vitest';
import { memoryRepository } from '../repositories/memoryRepository';
import { appConfig } from '../config/appConfig';
import { WORKFLOW_STATUSES, PLATFORMS } from '../config/constants';
import { formatDate, formatDateTime } from '../utils/dateUtils';
import { isValidUrl, isValidEmail } from '../utils/validationUtils';

describe('Phase 2 Core Architecture', () => {
  it('loads appConfig with mandatory defaults', () => {
    expect(appConfig.appName).toBe('Infineo Social Media Planner');
    expect(appConfig.defaultSeries.length).toBe(5);
  });

  it('verifies memoryRepository seeds users and content', async () => {
    const users = await memoryRepository.getUsers();
    expect(users.length).toBeGreaterThanOrEqual(4);

    const content = await memoryRepository.getContentItems();
    expect(content.length).toBeGreaterThanOrEqual(3);
  });

  it('validates workflow status constants and platforms', () => {
    expect(WORKFLOW_STATUSES).toContain('Idea');
    expect(WORKFLOW_STATUSES).toContain('Completed');
    expect(PLATFORMS).toHaveLength(4);
  });

  it('validates date and validation utilities', () => {
    expect(isValidUrl('https://canva.com/design/123')).toBe(true);
    expect(isValidUrl('invalid-url')).toBe(false);
    expect(isValidEmail('user@infineo.com')).toBe(true);
    expect(formatDate('2026-07-30T12:00:00Z')).toContain('2026');
  });
});
