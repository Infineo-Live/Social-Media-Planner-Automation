import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/appContext';
import { ROUTES, PLATFORMS, WORKFLOW_STATUSES } from '../config/constants';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { getSeriesColor } from '../config/seriesColors';
import { ContentItem, Platform } from '../types/content';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Search,
  Filter,
  CheckCircle2,
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PLATFORM_SHORT: Record<Platform, string> = {
  YouTube: 'YT',
  Instagram: 'IG',
  LinkedIn: 'LI',
  Twitter: 'X',
};

function buildCalendarGrid(year: number, month: number): (Date | null)[][] {
  // month is 0-indexed (JS convention)
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay(); // 0=Sun
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
  // isoStr is YYYY-MM-DD
  const [y, m, d] = isoStr.split('-').map(Number);
  return date.getFullYear() === y && date.getMonth() + 1 === m && date.getDate() === d;
}

function formatMonthYear(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface PlatformBadgesProps {
  item: ContentItem;
}

const PlatformBadges: React.FC<PlatformBadgesProps> = ({ item }) => (
  <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', marginTop: '2px' }}>
    {PLATFORMS.map((p) => {
      const scheduled = item.scheduled[p];
      const uploaded = item.uploaded[p];
      const active = scheduled || uploaded;
      return (
        <span
          key={p}
          title={`${p}: ${uploaded ? 'Uploaded' : scheduled ? 'Scheduled' : 'Not scheduled'}`}
          style={{
            fontSize: '9px',
            fontWeight: 600,
            padding: '1px 4px',
            borderRadius: '3px',
            backgroundColor: active ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)',
            color: active ? '#ffffff' : 'rgba(255,255,255,0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            letterSpacing: '0.02em',
          }}
        >
          {uploaded && (
            <CheckCircle2 size={8} style={{ color: '#10b981', flexShrink: 0 }} />
          )}
          {PLATFORM_SHORT[p]}
        </span>
      );
    })}
  </div>
);

interface CalendarCardProps {
  item: ContentItem;
  seriesName: string;
  seriesColor: { bg: string; text: string };
  onClick: () => void;
}

const CalendarCard: React.FC<CalendarCardProps> = ({ item, seriesName, seriesColor, onClick }) => (
  <div
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onClick()}
    title={item.title}
    style={{
      backgroundColor: seriesColor.bg,
      color: seriesColor.text,
      borderRadius: '4px',
      padding: '3px 5px',
      fontSize: '11px',
      cursor: 'pointer',
      marginBottom: '2px',
      minWidth: 0,
    }}
  >
    <div
      style={{
        fontWeight: 600,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: 1.3,
      }}
    >
      {item.title}
    </div>
    <div
      style={{
        fontSize: '9px',
        opacity: 0.85,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        marginTop: '1px',
      }}
    >
      {seriesName}
    </div>
    <PlatformBadges item={item} />
  </div>
);

// ─── Overflow modal ───────────────────────────────────────────────────────────

interface OverflowModalProps {
  date: Date;
  items: ContentItem[];
  seriesMap: Map<number, { name: string; color: { bg: string; text: string } }>;
  onClose: () => void;
  onItemClick: (id: number) => void;
}

const OverflowModal: React.FC<OverflowModalProps> = ({
  date,
  items,
  seriesMap,
  onClose,
  onItemClick,
}) => {
  const label = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '1.25rem',
          minWidth: '280px',
          maxWidth: '380px',
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
            {label}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '1.1rem',
              padding: '2px 6px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {items.map((item) => {
            const sr = seriesMap.get(item.seriesId) ?? {
              name: 'Unknown',
              color: { bg: '#334155', text: '#ffffff' },
            };
            return (
              <div
                key={item.contentId}
                onClick={() => {
                  onItemClick(item.contentId);
                  onClose();
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && (onItemClick(item.contentId), onClose())}
                style={{
                  backgroundColor: sr.color.bg,
                  color: sr.color.text,
                  borderRadius: '6px',
                  padding: '8px 10px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '2px' }}>
                  {sr.name}
                </div>
                <div style={{ marginTop: '4px' }}>
                  <PlatformBadges item={item} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Day Cell ──────────────────────────────────────────────────────────────────

const MAX_VISIBLE = 3;

interface DayCellProps {
  date: Date | null;
  items: ContentItem[];
  seriesMap: Map<number, { name: string; color: { bg: string; text: string } }>;
  onItemClick: (id: number) => void;
  onShowMore: (date: Date, items: ContentItem[]) => void;
}

const DayCell: React.FC<DayCellProps> = ({ date, items, seriesMap, onItemClick, onShowMore }) => {
  if (!date) {
    return (
      <td
        style={{
          backgroundColor: 'var(--bg-main)',
          border: '1px solid var(--border-color)',
          verticalAlign: 'top',
          padding: '4px',
          minHeight: '100px',
        }}
      />
    );
  }

  const today = isToday(date);
  const visible = items.slice(0, MAX_VISIBLE);
  const overflow = items.length - MAX_VISIBLE;

  return (
    <td
      style={{
        border: '1px solid var(--border-color)',
        verticalAlign: 'top',
        padding: '4px',
        minHeight: '100px',
        backgroundColor: today ? 'rgba(99,102,241,0.08)' : 'var(--bg-card)',
        position: 'relative',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          fontWeight: today ? 700 : 500,
          color: today ? '#ffffff' : 'var(--text-secondary)',
          marginBottom: '4px',
          width: '22px',
          height: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: today ? '50%' : undefined,
          backgroundColor: today ? 'var(--accent-primary)' : undefined,
        }}
      >
        {date.getDate()}
      </div>
      {visible.map((item) => {
        const sr = seriesMap.get(item.seriesId) ?? {
          name: 'Unknown',
          color: { bg: '#334155', text: '#ffffff' },
        };
        return (
          <CalendarCard
            key={item.contentId}
            item={item}
            seriesName={sr.name}
            seriesColor={sr.color}
            onClick={() => onItemClick(item.contentId)}
          />
        );
      })}
      {overflow > 0 && (
        <button
          onClick={() => onShowMore(date, items)}
          style={{
            fontSize: '10px',
            color: 'var(--accent-primary)',
            background: 'transparent',
            border: 'none',
            padding: '1px 0',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          +{overflow} more
        </button>
      )}
    </td>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export const ContentCalendar: React.FC = () => {
  const { contentItems, seriesList, isLoading } = useApp();
  const navigate = useNavigate();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeriesId, setSelectedSeriesId] = useState<number | 'all'>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string | 'all'>('all');

  const [overflowModal, setOverflowModal] = useState<{
    date: Date;
    items: ContentItem[];
  } | null>(null);

  // Build stable series lookup map
  const seriesMap = useMemo(
    () =>
      new Map(
        seriesList.map((s) => [
          s.seriesId,
          { name: s.name, shortCode: s.shortCode, color: getSeriesColor(s.seriesId) },
        ])
      ),
    [seriesList]
  );

  // Filter items
  const filtered = useMemo(() => {
    return contentItems.filter((item) => {
      if (!item.plannedUploadDate) return false;

      if (
        searchTerm &&
        !item.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;

      if (selectedSeriesId !== 'all' && item.seriesId !== selectedSeriesId) return false;

      if (selectedStatus !== 'all' && item.currentStatus !== selectedStatus) return false;

      if (selectedPlatform !== 'all') {
        const s = item.scheduled[selectedPlatform];
        const u = item.uploaded[selectedPlatform];
        if (!s && !u) return false;
      }

      return true;
    });
  }, [contentItems, searchTerm, selectedSeriesId, selectedStatus, selectedPlatform]);

  // Items for current month
  const itemsThisMonth = useMemo(
    () =>
      filtered.filter((item) => {
        if (!item.plannedUploadDate) return false;
        const [y, m] = item.plannedUploadDate.split('-').map(Number);
        return y === year && m - 1 === month;
      }),
    [filtered, year, month]
  );

  // Group by day string
  const itemsByDay = useMemo(() => {
    const map = new Map<string, ContentItem[]>();
    for (const item of itemsThisMonth) {
      const key = item.plannedUploadDate!;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return map;
  }, [itemsThisMonth]);

  const grid = useMemo(() => buildCalendarGrid(year, month), [year, month]);

  // Navigation
  const prevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const goToday = () => {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  };

  const goToDetail = (id: number) =>
    navigate(ROUTES.CONTENT_DETAIL.replace(':id', String(id)));

  if (isLoading) return <LoadingSpinner />;

  const selectStyle: React.CSSProperties = {
    padding: '0.5rem 0.75rem',
    backgroundColor: 'var(--bg-main)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    color: 'var(--text-primary)',
    fontSize: '0.8rem',
  };

  const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Content Calendar
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '2px' }}>
          Monthly view of all planned content by upload date.
        </p>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '0.875rem 1rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
        }}
      >
        {/* Search */}
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.6rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            id="calendar-search"
            type="text"
            placeholder="Search by title…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem 0.5rem 2.1rem',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.8rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />

          <select
            id="calendar-filter-series"
            value={selectedSeriesId}
            onChange={(e) =>
              setSelectedSeriesId(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            style={selectStyle}
          >
            <option value="all">All Series</option>
            {seriesList.map((s) => (
              <option key={s.seriesId} value={s.seriesId}>
                [{s.shortCode}] {s.name}
              </option>
            ))}
          </select>

          <select
            id="calendar-filter-platform"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value as Platform | 'all')}
            style={selectStyle}
          >
            <option value="all">All Platforms</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            id="calendar-filter-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={selectStyle}
          >
            <option value="all">All Statuses</option>
            {WORKFLOW_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.875rem 1rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              id="calendar-prev-month"
              onClick={prevMonth}
              style={{
                background: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '5px 9px',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <span
              style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', minWidth: '160px', textAlign: 'center' }}
            >
              {formatMonthYear(year, month)}
            </span>
            <button
              id="calendar-next-month"
              onClick={nextMonth}
              style={{
                background: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '5px 9px',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            id="calendar-today"
            onClick={goToday}
            style={{
              background: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '5px 12px',
              color: 'var(--accent-primary)',
              fontWeight: 600,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <CalendarDays size={14} />
            Today
          </button>
        </div>

        {/* Calendar Grid */}
        {itemsThisMonth.length === 0 && filtered.length > 0 ? (
          <div style={{ padding: '2rem' }}>
            <EmptyState
              title="No Content This Month"
              message="There are no content items with a planned upload date in this month. Use the navigation to browse other months."
            />
          </div>
        ) : itemsThisMonth.length === 0 && filtered.length === 0 && contentItems.filter(i => i.plannedUploadDate).length === 0 ? (
          <div style={{ padding: '2rem' }}>
            <EmptyState
              title="No Scheduled Content"
              message="No content items have a Planned Upload Date set. Add dates in the Content Detail view."
            />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}
            >
              <thead>
                <tr>
                  {DAY_HEADERS.map((d) => (
                    <th
                      key={d}
                      style={{
                        padding: '6px 8px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        textAlign: 'center',
                        borderBottom: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-main)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grid.map((row, rowIdx) => (
                  <tr key={rowIdx} style={{ height: '110px' }}>
                    {row.map((date, colIdx) => {
                      const dayItems = date
                        ? (() => {
                            // Match items for this exact date
                            const result: ContentItem[] = [];
                            for (const [key, vals] of itemsByDay.entries()) {
                              if (isSameDay(date, key)) result.push(...vals);
                            }
                            return result;
                          })()
                        : [];
                      return (
                        <DayCell
                          key={colIdx}
                          date={date}
                          items={dayItems}
                          seriesMap={seriesMap}
                          onItemClick={goToDetail}
                          onShowMore={(d, items) => setOverflowModal({ date: d, items })}
                        />
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Series Legend */}
      {seriesList.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '4px' }}>
            Series:
          </span>
          {seriesList.map((s) => {
            const c = getSeriesColor(s.seriesId);
            return (
              <span
                key={s.seriesId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '2px',
                    backgroundColor: c.bg,
                    flexShrink: 0,
                  }}
                />
                {s.shortCode}
              </span>
            );
          })}
          <span
            style={{
              marginLeft: 'auto',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <CheckCircle2 size={11} style={{ color: '#10b981' }} />
            = Uploaded
          </span>
        </div>
      )}

      {/* Overflow modal */}
      {overflowModal && (
        <OverflowModal
          date={overflowModal.date}
          items={overflowModal.items}
          seriesMap={seriesMap}
          onClose={() => setOverflowModal(null)}
          onItemClick={goToDetail}
        />
      )}
    </div>
  );
};
