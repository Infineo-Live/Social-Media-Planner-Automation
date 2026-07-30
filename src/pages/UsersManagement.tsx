import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/authContext';
import { dataRepository } from '../repositories/dataRepository';
import { User, UserRole } from '../types/user';
import { Users, Plus, Shield, UserCheck, UserX } from 'lucide-react';

export const UsersManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Employee');
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    const list = await dataRepository.getUsers();
    setUsers(list);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (!currentUser || currentUser.role !== 'Admin') return <div>Access Denied.</div>;

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await dataRepository.createUser({
        fullName: fullName.trim(),
        email: email.trim(),
        role,
        active: true,
      });
      setShowAddModal(false);
      setFullName('');
      setEmail('');
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to add user.');
    }
  };

  const handleToggleActive = async (user: User) => {
    await dataRepository.updateUser(user.userId, { active: !user.active });
    await loadUsers();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            User Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Manage organization users, roles, and access status.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
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
            cursor: 'pointer',
          }}
        >
          <Plus size={18} />
          Add Authorized User
        </button>
      </div>

      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '1.75rem',
              width: '90%',
              maxWidth: '440px',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Add Authorized User
            </h3>
            {error && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.5rem 0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Google Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600 }}
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Table */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>User ID</th>
                <th style={{ padding: '0.85rem 1rem' }}>Full Name</th>
                <th style={{ padding: '0.85rem 1rem' }}>Email</th>
                <th style={{ padding: '0.85rem 1rem' }}>Role</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.userId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>#{u.userId}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{u.fullName}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ color: u.active ? 'var(--success)' : 'var(--danger)', fontWeight: 600, fontSize: '0.8rem' }}>
                      {u.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <button
                      onClick={() => handleToggleActive(u)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        backgroundColor: 'var(--bg-main)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        color: u.active ? 'var(--danger)' : 'var(--success)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      {u.active ? <UserX size={14} /> : <UserCheck size={14} />}
                      {u.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
