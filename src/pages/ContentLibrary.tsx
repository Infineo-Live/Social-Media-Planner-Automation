import React, { useState } from 'react';
import { useApp } from '../context/appContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES, WORKFLOW_STATUSES } from '../config/constants';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { Search, Filter, Plus, Eye } from 'lucide-react';

export const ContentLibrary: React.FC = () => {
  const { contentItems, seriesList } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string | 'all'>('all');

  const filteredItems = contentItems.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      (item.workingTitle && item.workingTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.realLifeProblem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.mythologyStory && item.mythologyStory.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSeries = selectedSeries === 'all' || item.seriesId === Number(selectedSeries);
    const matchesStatus = selectedStatus === 'all' || item.currentStatus === selectedStatus;

    return matchesSearch && matchesSeries && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Content Library
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Master content repository and publishing pipeline.
          </p>
        </div>
        <button
          onClick={() => navigate(ROUTES.CONTENT_CREATE)}
          style={{
            padding: '0.65rem 1.25rem',
            backgroundColor: 'var(--accent-primary)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
          }}
        >
          <Plus size={18} />
          Create New Idea
        </button>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search title, problem statement, or mythology story..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem 0.6rem 2.5rem',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          <select
            value={selectedSeries}
            onChange={(e) => setSelectedSeries(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            style={{
              padding: '0.6rem 0.75rem',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
            }}
          >
            <option value="all">All Series</option>
            {seriesList.map((s) => (
              <option key={s.seriesId} value={s.seriesId}>
                [{s.shortCode}] {s.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '0.6rem 0.75rem',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
            }}
          >
            <option value="all">All Workflow Statuses</option>
            {WORKFLOW_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Table */}
      {filteredItems.length === 0 ? (
        <EmptyState title="No Matching Content Found" message="Try adjusting your search criteria or series filters." />
      ) : (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>ID</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Series</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Working Title / Problem</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const s = seriesList.find((sr) => sr.seriesId === item.seriesId);
                  return (
                    <tr key={item.contentId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>#{item.contentId}</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                        {s ? s.shortCode : '-'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {item.workingTitle || item.realLifeProblem}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <StatusBadge status={item.currentStatus} />
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <button
                          onClick={() => navigate(ROUTES.CONTENT_DETAIL.replace(':id', String(item.contentId)))}
                          style={{
                            padding: '0.4rem 0.85rem',
                            backgroundColor: 'var(--bg-main)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            color: 'var(--text-primary)',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <Eye size={14} />
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
