import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import { appConfig } from '../config/appConfig';
import { ROUTES } from '../config/constants';
import { LogIn, ShieldAlert } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (isAuthenticated) {
    navigate(ROUTES.DASHBOARD);
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!emailInput.trim()) {
      setErrorMsg('Please enter a valid Google account email.');
      return;
    }

    const success = await login(emailInput.trim());
    if (success) {
      navigate(ROUTES.DASHBOARD);
    } else {
      setErrorMsg('Access Denied: Your Google account is not authorized or is inactive.');
    }
  };

  const handleQuickLogin = async (email: string) => {
    setErrorMsg(null);
    setEmailInput(email);
    const success = await login(email);
    if (success) {
      navigate(ROUTES.DASHBOARD);
    } else {
      setErrorMsg('Access Denied: Account not authorized or inactive.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-main)',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '2.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: '0 auto 1rem auto',
            }}
          >
            I
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {appConfig.appName}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {appConfig.companyName} Internal Content Workflow
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--danger)',
              borderRadius: '6px',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--danger)',
              fontSize: '0.875rem',
            }}
          >
            <ShieldAlert size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
              }}
            >
              Google Account Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="user@infineo.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <LogIn size={18} />
            Sign In with Google
          </button>
        </form>

        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Quick Role Switcher (Development Mode):
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => handleQuickLogin('admin@infineo.com')}
              style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid var(--accent-primary)',
                borderRadius: '4px',
                color: 'var(--accent-primary)',
                fontSize: '0.85rem',
                textAlign: 'left',
              }}
            >
              <strong>Admin:</strong> admin@infineo.com
            </button>
            <button
              onClick={() => handleQuickLogin('manager@infineo.com')}
              style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid var(--info)',
                borderRadius: '4px',
                color: 'var(--info)',
                fontSize: '0.85rem',
                textAlign: 'left',
              }}
            >
              <strong>Manager:</strong> manager@infineo.com
            </button>
            <button
              onClick={() => handleQuickLogin('rahul@infineo.com')}
              style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid var(--success)',
                borderRadius: '4px',
                color: 'var(--success)',
                fontSize: '0.85rem',
                textAlign: 'left',
              }}
            >
              <strong>Employee:</strong> rahul@infineo.com
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
