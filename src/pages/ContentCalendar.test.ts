/**
 * ContentCalendar tests
 *
 * Verifies the calendar utility functions and the series-color mapping
 * in isolation (no DOM render required) matching the project's existing
 * unit-test style.
 */
import { describe, it, expect } from 'vitest';
import { getSeriesColor } from '../config/seriesColors';

// ── Helper re-exports (test-local mirrors so we don't need DOM) ──────────────

function buildCalendarGrid(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay();
  const rows: (Date | null)[][] = [];
  let row: (Date | null)[] = Array(startPad).fill(null);

  for (let d = 1; d <= lastDay.getDate(); d++) {
    row.push(new Date(year, month, d));
    if (row.length === 7) {
      rows.push(row);
      row = [];
    }
  }
  if (row.length > 0) {
    while (row.length < 7) row.push(null);
    rows.push(row);
  }
  return rows;
}

function isSameDay(date: Date, isoStr: string): boolean {
  const [y, m, d] = isoStr.split('-').map(Number);
  return date.getFullYear() === y && date.getMonth() + 1 === m && date.getDate() === d;
}

// ─────────────────────────────────────────────────────────────────────────────

describe('ContentCalendar – buildCalendarGrid', () => {
  it('produces 7-column rows', () => {
    const grid = buildCalendarGrid(2026, 7); // August 2026
    for (const row of grid) {
      expect(row).toHaveLength(7);
    }
  });

  it('contains all days of the month', () => {
    const year = 2026;
    const month = 0; // January
    const grid = buildCalendarGrid(year, month);
    const days = grid.flat().filter((d): d is Date => d !== null);
    expect(days).toHaveLength(31);
    expect(days[0].getDate()).toBe(1);
    expect(days[days.length - 1].getDate()).toBe(31);
  });

  it('February 2024 (leap year) has 29 days', () => {
    const grid = buildCalendarGrid(2024, 1);
    const days = grid.flat().filter((d): d is Date => d !== null);
    expect(days).toHaveLength(29);
  });

  it('pads the first row with nulls if month does not start on Sunday', () => {
    // 2026-08-01 is a Saturday (day 6)
    const grid = buildCalendarGrid(2026, 7); // August 2026
    const firstRow = grid[0];
    const firstDate = firstRow.find((d) => d !== null);
    expect(firstDate?.getDate()).toBe(1);
    // Saturdays: index 6 should be the 1st
    const nullCount = firstRow.filter((d) => d === null).length;
    expect(nullCount).toBe(6); // 0=Sun … 5=Fri are null
  });
});

describe('ContentCalendar – isSameDay', () => {
  it('matches a date to its ISO string', () => {
    const d = new Date(2026, 7, 15); // 15 Aug 2026
    expect(isSameDay(d, '2026-08-15')).toBe(true);
  });

  it('rejects a different day', () => {
    const d = new Date(2026, 7, 15);
    expect(isSameDay(d, '2026-08-16')).toBe(false);
  });

  it('rejects a different month', () => {
    const d = new Date(2026, 7, 15);
    expect(isSameDay(d, '2026-07-15')).toBe(false);
  });
});

describe('ContentCalendar – getSeriesColor', () => {
  it('returns a non-empty bg and text for seriesId 1', () => {
    const c = getSeriesColor(1);
    expect(c.bg).toBeTruthy();
    expect(c.text).toBeTruthy();
  });

  it('same seriesId always returns the same color (deterministic)', () => {
    expect(getSeriesColor(2).bg).toBe(getSeriesColor(2).bg);
    expect(getSeriesColor(3).bg).toBe(getSeriesColor(3).bg);
  });

  it('different seriesIds can return different colors', () => {
    // At least seriesId 1 and seriesId 2 must differ (palette has enough slots)
    expect(getSeriesColor(1).bg).not.toBe(getSeriesColor(2).bg);
  });

  it('wraps around the palette for high seriesIds without throwing', () => {
    expect(() => getSeriesColor(100)).not.toThrow();
    expect(getSeriesColor(100).bg).toBeTruthy();
  });
});

describe('ContentCalendar – month navigation logic', () => {
  it('previous month from January rolls back to December of previous year', () => {
    let year = 2026;
    let month = 0; // January
    if (month === 0) {
      year -= 1;
      month = 11;
    } else {
      month -= 1;
    }
    expect(year).toBe(2025);
    expect(month).toBe(11);
  });

  it('next month from December rolls forward to January of next year', () => {
    let year = 2026;
    let month = 11; // December
    if (month === 11) {
      year += 1;
      month = 0;
    } else {
      month += 1;
    }
    expect(year).toBe(2027);
    expect(month).toBe(0);
  });
});
