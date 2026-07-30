import React from 'react';
import { useAuth } from '../auth/authContext';
import { useApp } from '../context/appContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/constants';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const Approvals: React.FC = () => {
  const { currentUser } = useAuth();
  const { contentItems } = useApp();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const approvalItems = contentItems.filter((item) => {
    if (currentUser.role === 'Admin') {
      return item.currentStatus.includes('Review');
    }
    if (currentUser.role === 'Manager') {
      return item.currentStatus.includes('Manager');
    }
    return false;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Approval Queue
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Ideas, Scripts, and Reels pending your review and approval.
        </p>
      </div>

      {approvalItems.length === 0 ? (
        <EmptyState
          title="Approval Queue Empty"
          message="There are no items currently waiting for your review."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {approvalItems.map((item) => (
            <div
              key={item.contentId}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>#{item.contentId}</span>
                  <StatusBadge status={item.currentStatus} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {item.workingTitle || item.realLifeProblem}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {item.realLifeProblem}
                </p>
              </div>

              <button
                onClick={() => navigate(ROUTES.CONTENT_DETAIL.replace(':id', String(item.contentId)))}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  backgroundColor: 'var(--warning)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                Review Item
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
