import React from 'react';
import { useAuth } from '../auth/authContext';
import { useApp } from '../context/appContext';
import { dataRepository } from '../repositories/dataRepository';
import { EmptyState } from '../components/EmptyState';
import { Bell, CheckCheck, Clock } from 'lucide-react';
import { formatDateTime } from '../utils/dateUtils';

export const NotificationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { notifications, refreshData } = useApp();

  if (!currentUser) return null;

  const handleMarkAllRead = async () => {
    await dataRepository.markAllAsRead(currentUser.userId);
    await refreshData();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Notifications Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Workflow stage changes, assignments, and approvals.
          </p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <CheckCheck size={16} />
            Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          title="No Notifications"
          message="You have no unread or recent activity notifications."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map((notif) => (
            <div
              key={notif.notificationId}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                opacity: notif.read ? 0.7 : 1,
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: notif.read ? 'var(--bg-main)' : 'rgba(99, 102, 241, 0.1)',
                  color: notif.read ? 'var(--text-muted)' : 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Bell size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  {notif.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  {notif.message}
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} />
                  {formatDateTime(notif.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
