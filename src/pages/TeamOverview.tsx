import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/authContext';
import { useApp } from '../context/appContext';
import { dataRepository } from '../repositories/dataRepository';
import { User } from '../types/user';
import { Users, CheckSquare, Clock } from 'lucide-react';

export const TeamOverview: React.FC = () => {
  const { currentUser } = useAuth();
  const { contentItems } = useApp();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    dataRepository.getUsers().then(setUsers);
  }, []);

  if (!currentUser || (currentUser.role !== 'Admin' && currentUser.role !== 'Manager')) {
    return <div>Access Denied.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Team Workload Overview
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Monitor active task assignments across all employees and managers.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {users.map((user) => {
          const assigned = contentItems.filter((i) => i.assignedUserId === user.userId);
          return (
            <div
              key={user.userId}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {user.fullName}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</span>
                </div>
                <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>
                  {user.role}
                </span>
              </div>

              <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.75rem 1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Active Tasks:</span>
                <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{assigned.length}</strong>
              </div>

              {assigned.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {assigned.map((item) => (
                    <div key={item.contentId} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>#{item.contentId} {item.workingTitle || item.realLifeProblem.slice(0, 20)}...</span>
                      <strong style={{ color: 'var(--accent-primary)' }}>{item.currentStatus}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
