import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import { ROUTES } from '../config/constants';
import {
  LayoutDashboard,
  CheckSquare,
  FolderPlus,
  CheckCircle2,
  Library,
  CalendarDays,
  Users,
  Settings,
  User,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.65rem 1rem',
    borderRadius: '6px',
    color: isActive ? '#ffffff' : 'var(--text-secondary)',
    backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
    fontWeight: isActive ? 600 : 400,
    fontSize: '0.9rem',
    marginBottom: '0.25rem',
    transition: 'background-color 0.15s ease',
  });

  return (
    <aside
      style={{
        width: '240px',
        backgroundColor: 'var(--bg-card)',
        borderRight: '1px solid var(--border-color)',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        minHeight: 'calc(100vh - 60px)',
      }}
    >
      <nav style={{ display: 'flex', flexDirection: 'column' }}>
        <NavLink to={ROUTES.DASHBOARD} style={linkStyle}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to={ROUTES.MY_TASKS} style={linkStyle}>
          <CheckSquare size={18} />
          My Tasks
        </NavLink>

        {currentUser.role === 'Employee' && (
          <NavLink to={ROUTES.AVAILABLE_WORK} style={linkStyle}>
            <FolderPlus size={18} />
            Available Work
          </NavLink>
        )}

        {(currentUser.role === 'Manager' || currentUser.role === 'Admin') && (
          <NavLink to={ROUTES.APPROVALS} style={linkStyle}>
            <CheckCircle2 size={18} />
            Approvals
          </NavLink>
        )}

        <NavLink to={ROUTES.CONTENT_LIBRARY} style={linkStyle}>
          <Library size={18} />
          Content Library
        </NavLink>

        <NavLink to={ROUTES.CONTENT_CALENDAR} style={linkStyle}>
          <CalendarDays size={18} />
          Content Calendar
        </NavLink>

        {currentUser.role === 'Admin' && (
          <>
            <div style={{ margin: '1rem 0 0.5rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Administration
            </div>
            <NavLink to={ROUTES.USERS} style={linkStyle}>
              <Users size={18} />
              Users
            </NavLink>
            <NavLink to={ROUTES.SETTINGS} style={linkStyle}>
              <Settings size={18} />
              Settings
            </NavLink>
          </>
        )}
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
        <NavLink to={ROUTES.PROFILE} style={linkStyle}>
          <User size={18} />
          My Profile
        </NavLink>
      </div>
    </aside>
  );
};
