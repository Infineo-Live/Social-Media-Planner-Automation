import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ContentLibrary } from './ContentLibrary';
import { User } from '../types/user';
import { ContentItem } from '../types/content';

vi.mock('../auth/authContext', () => ({
  useAuth: () => ({
    currentUser: {
      userId: 1,
      email: 'admin@infineo.io',
      fullName: 'Admin User',
      role: 'Admin',
      active: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    } as User,
  }),
}));

const mockItems: Partial<ContentItem>[] = [
  {
    contentId: 101,
    seriesId: 1,
    title: 'Unassigned Content 1',
    currentStatus: 'Idea',
    createdByUserId: 1,
    assignedUserId: undefined,
  },
  {
    contentId: 102,
    seriesId: 1,
    title: 'Assigned Content 1',
    currentStatus: 'Script WIP',
    createdByUserId: 1,
    assignedUserId: 2,
  },
  {
    contentId: 103,
    seriesId: 1,
    title: 'Unassigned Content 2',
    currentStatus: 'Idea',
    createdByUserId: 1,
    assignedUserId: undefined,
  },
  {
    contentId: 104,
    seriesId: 1,
    title: 'Assigned Content 2',
    currentStatus: 'Reel WIP',
    createdByUserId: 1,
    assignedUserId: 3,
  },
];

vi.mock('../context/appContext', () => ({
  useApp: () => ({
    contentItems: mockItems as ContentItem[],
    seriesList: [{ seriesId: 1, name: 'Series A', shortCode: 'SA', active: true }],
    subSeriesList: [],
    notifications: [],
    isLoading: false,
    refreshData: async () => {},
  }),
}));

describe('ContentLibrary sorting', () => {
  it('displays assigned content before unassigned content while preserving relative order within groups', () => {
    const { container } = render(
      <MemoryRouter>
        <ContentLibrary />
      </MemoryRouter>
    );

    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(4);

    // Row order should be: #102 (Assigned Content 1), #104 (Assigned Content 2), #101 (Unassigned Content 1), #103 (Unassigned Content 2)
    expect(rows[0].textContent).toContain('Assigned Content 1');
    expect(rows[1].textContent).toContain('Assigned Content 2');
    expect(rows[2].textContent).toContain('Unassigned Content 1');
    expect(rows[3].textContent).toContain('Unassigned Content 2');
  });

  it('renders assignment select elements for privileged users (Manager/Admin)', () => {
    const { container } = render(
      <MemoryRouter>
        <ContentLibrary />
      </MemoryRouter>
    );

    const selects = container.querySelectorAll('tbody select');
    expect(selects.length).toBe(4);
  });
});

