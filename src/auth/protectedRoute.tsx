import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';
import { UserRole } from '../types/user';
import { ROUTES } from '../config/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { currentUser, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading user session...
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!currentUser.active) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--danger)' }}>
        Your account is inactive. Please contact an Administrator.
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--danger)' }}>
        Access Denied: You do not have permission to view this page.
      </div>
    );
  }

  return <>{children}</>;
};
