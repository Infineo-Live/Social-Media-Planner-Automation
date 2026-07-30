import React from 'react';
import { useAuth } from '../auth/authContext';
import { formatDate } from '../utils/dateUtils';
import { User as UserIcon, Shield, Mail, Calendar } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          User Profile
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Your authenticated session and role details.
        </p>
      </div>

      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
          }}
        >
          {currentUser.fullName.charAt(0)}
        </div>

        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {currentUser.fullName}
          </h2>
          <span style={{ display: 'inline-block', marginTop: '0.25rem', padding: '0.2rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
            {currentUser.role}
          </span>
        </div>

        <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', textAlign: 'left', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
            <Mail size={18} style={{ color: 'var(--text-muted)' }} />
            <span>Email: <strong style={{ color: 'var(--text-primary)' }}>{currentUser.email}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
            <Shield size={18} style={{ color: 'var(--text-muted)' }} />
            <span>Account Status: <strong style={{ color: 'var(--success)' }}>{currentUser.active ? 'Active' : 'Inactive'}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
            <Calendar size={18} style={{ color: 'var(--text-muted)' }} />
            <span>Member Since: <strong style={{ color: 'var(--text-primary)' }}>{formatDate(currentUser.createdAt)}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
