import React from 'react';
import { useAuth } from '../auth/authContext';
import { useApp } from '../context/appContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/constants';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { WorkflowEngine } from '../services/workflowEngine';
import { useToast } from '../context/ToastContext';
import { FolderPlus, CheckCircle } from 'lucide-react';

export const AvailableWork: React.FC = () => {
  const { currentUser } = useAuth();
  const { contentItems, refreshData } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const claimable = contentItems.filter(
    (item) =>
      (item.currentStatus === 'Script WIP' || item.currentStatus === 'Reel WIP') &&
      !item.assignedUserId
  );

  const handleClaim = async (item: typeof claimable[0]) => {
    try {
      if (item.currentStatus === 'Script WIP') {
        await WorkflowEngine.claimScript(currentUser, item.contentId);
      } else if (item.currentStatus === 'Reel WIP') {
        await WorkflowEngine.claimReel(currentUser, item.contentId);
      }
      await refreshData();
      showToast('Task claimed successfully!', 'success');
      navigate(ROUTES.MY_TASKS);
    } catch (err: any) {
      showToast(err.message || 'Failed to claim task.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Available Work Queue
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Unassigned scripts and reels available to claim and work on.
        </p>
      </div>

      {claimable.length === 0 ? (
        <EmptyState
          title="No Available Work"
          message="All current script and reel tasks are already claimed or in review."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {claimable.map((item) => (
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
                  {item.title}
                </h3>
              </div>

              <button
                onClick={() => handleClaim(item)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  backgroundColor: 'var(--success)',
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
                <CheckCircle size={18} />
                Claim Task
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
