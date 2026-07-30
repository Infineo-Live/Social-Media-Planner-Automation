import { describe, it, expect, beforeEach } from 'vitest';
import { BusinessFeaturesService } from './businessFeatures';
import { dataRepository } from '../repositories/dataRepository';
import { ContentItem } from '../types/content';
import { User } from '../types/user';

describe('Phase 7 Business Features Integration', () => {
  let admin: User;
  let employee: User;
  let testItems: ContentItem[];

  beforeEach(async () => {
    admin = (await dataRepository.getUserByEmail('admin@infineo.com'))!;
    employee = (await dataRepository.getUserByEmail('rahul@infineo.com'))!;
    testItems = await dataRepository.getContentItems();
  });

  it('filters content by multi-criteria search and status', () => {
    const filtered = BusinessFeaturesService.filterContentItems(testItems, {
      status: 'Script WIP',
    });
    expect(filtered.every((i) => i.currentStatus === 'Script WIP')).toBe(true);
  });

  it('filters content by full-text search term across title, problem, and story', () => {
    const filtered = BusinessFeaturesService.filterContentItems(testItems, {
      searchTerm: 'Krishna',
    });
    expect(filtered.length).toBeGreaterThanOrEqual(1);

    const matches = filtered.some((item) => {
      const text = `${item.workingTitle || ''} ${item.realLifeProblem} ${item.mythologyStory || ''}`;
      return text.toLowerCase().includes('krishna');
    });
    expect(matches).toBe(true);
  });

  it('executes bulk reassigned business action', async () => {
    const itemsToAssign = testItems.slice(0, 2).map((i) => i.contentId);
    const reassignedCount = await BusinessFeaturesService.bulkReassign(
      admin,
      itemsToAssign,
      employee.userId
    );
    expect(reassignedCount).toBe(2);

    const item1 = await dataRepository.getContentItemById(itemsToAssign[0]);
    expect(item1?.assignedUserId).toBe(employee.userId);
  });
});
