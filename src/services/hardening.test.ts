import { describe, it, expect, beforeEach } from 'vitest';
import { HardeningService } from './hardeningService';
import { dataRepository } from '../repositories/dataRepository';
import { ValidationError } from './errorFramework';
import { User } from '../types/user';

describe('Phase 10 Application Hardening & Edge Cases', () => {
  let activeUserWithTask: User;

  beforeEach(async () => {
    // Rahul Sharma has active task #102
    activeUserWithTask = (await dataRepository.getUserByEmail('rahul@infineo.com'))!;
  });

  it('blocks deactivating user who has active assigned tasks', async () => {
    await expect(
      HardeningService.safeDeactivateUser(activeUserWithTask.userId)
    ).rejects.toThrow(ValidationError);
  });

  it('blocks deactivating series with linked content items', async () => {
    await expect(HardeningService.safeDeactivateSeries(1)).rejects.toThrow(ValidationError);
  });

  it('sanitizes inputs against script injection', () => {
    const maliciousInput = '<script>alert("XSS")</script>';
    const sanitized = HardeningService.sanitizeString(maliciousInput);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('&lt;script&gt;');
  });
});
