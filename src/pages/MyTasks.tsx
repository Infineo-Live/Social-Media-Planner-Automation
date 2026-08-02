import React from 'react';
import { useAuth } from '../auth/authContext';
import { useApp } from '../context/appContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/constants';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { CheckSquare, ArrowRight } from 'lucide-react';

export const MyTasks: React.FC = () => {
  const { currentUser } = useAuth();
  const { contentItems } = useApp();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const myTasks = contentItems.filter(
    (item) => item.assignedUserId === currentUser.userId
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          My Assigned Tasks
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Tasks assigned to you requiring action or submission.
        </p>
      </div>

      {myTasks.length === 0 ? (
        <EmptyState
          title="No Active Tasks"
          message="You currently have no tasks assigned to you. Check 'Available Work' to claim new tasks."
          actionButton={
            <button
              onClick={() => navigate(ROUTES.AVAILABLE_WORK)}
              style={{
                padding: '0.6rem 1.2rem',
                backgroundColor: 'var(--accent-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Browse Available Work
            </button>
          }
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {myTasks.map((item) => (
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
                onClick={() => navigate(ROUTES.CONTENT_DETAIL.replace(':id', String(item.contentId)))}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  backgroundColor: 'var(--accent-primary)',
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
                Work on Task
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
