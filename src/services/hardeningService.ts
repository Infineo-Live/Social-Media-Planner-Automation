import { dataRepository } from '../repositories/dataRepository';
import { ValidationError } from './errorFramework';

export class HardeningService {
  // Edge Case: Check if user can be deactivated safely
  static async safeDeactivateUser(userId: number): Promise<boolean> {
    const allContent = await dataRepository.getContentItems();
    const activeAssigned = allContent.filter(
      (c) =>
        c.assignedUserId === userId &&
        c.currentStatus !== 'Completed' &&
        c.currentStatus !== 'Uploaded'
    );

    if (activeAssigned.length > 0) {
      throw new ValidationError(
        `Cannot deactivate User #${userId}. They still have ${activeAssigned.length} active assigned tasks. Please reassign their tasks first.`
      );
    }

    await dataRepository.updateUser(userId, { active: false });
    return true;
  }

  // Edge Case: Check if Series can be deactivated safely
  static async safeDeactivateSeries(seriesId: number): Promise<boolean> {
    const allContent = await dataRepository.getContentItems();
    const linked = allContent.filter((c) => c.seriesId === seriesId);

    if (linked.length > 0) {
      throw new ValidationError(
        `Cannot deactivate Series #${seriesId}. It has ${linked.length} linked content items.`
      );
    }

    await dataRepository.updateSeries(seriesId, { active: false });
    return true;
  }

  // Input Sanitization against basic HTML script injection
  static sanitizeString(input?: string): string {
    if (!input) return '';
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
}
