import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/constants';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--danger)',
          marginBottom: '1rem',
        }}
      >
        <ShieldAlert size={36} />
      </div>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
        403 - Access Denied
      </h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '1.5rem' }}>
        You do not have permission to access the requested resource or perform this action.
      </p>
      <button
        onClick={() => navigate(ROUTES.DASHBOARD)}
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
        }}
      >
        <ArrowLeft size={18} />
        Return to Dashboard
      </button>
    </div>
  );
};
