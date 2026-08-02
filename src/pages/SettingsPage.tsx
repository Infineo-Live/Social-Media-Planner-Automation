import React, { useState } from 'react';
import { useAuth } from '../auth/authContext';
import { useApp } from '../context/appContext';
import { useToast } from '../context/ToastContext';
import { dataRepository } from '../repositories/dataRepository';
import { Settings as SettingsIcon, Plus, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { seriesList, subSeriesList, refreshData } = useApp();
  const { showToast } = useToast();

  const [newSeriesName, setNewSeriesName] = useState('');
  const [newSeriesCode, setNewSeriesCode] = useState('');
  const [newSubSeriesName, setNewSubSeriesName] = useState('');

  if (!currentUser || currentUser.role !== 'Admin') return <div>Access Denied.</div>;

  const handleAddSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dataRepository.addSeries({
        name: newSeriesName.trim(),
        shortCode: newSeriesCode.trim().toUpperCase(),
        active: true,
      });
      setNewSeriesName('');
      setNewSeriesCode('');
      showToast('Series added successfully!', 'success');
      await refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to add series.', 'error');
    }
  };

  const handleAddSubSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dataRepository.addSubSeries({
        name: newSubSeriesName.trim(),
        active: true,
      });
      setNewSubSeriesName('');
      showToast('Sub-Series added successfully!', 'success');
      await refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to add sub-series.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          System Settings & Master Data
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Configure Series, Sub-Series, Festivals, and global application parameters.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Manage Series */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Series Configuration
          </h2>

          <form onSubmit={handleAddSeries} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              required
              placeholder="Series Name (e.g. Neo Ki Paathshala)"
              value={newSeriesName}
              onChange={(e) => setNewSeriesName(e.target.value)}
              style={{ width: '100%', padding: '0.65rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
            />
            <input
              type="text"
              required
              placeholder="Short Code (e.g. NKPS)"
              value={newSeriesCode}
              onChange={(e) => setNewSeriesCode(e.target.value)}
              style={{ width: '100%', padding: '0.65rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
            />
            <button
              type="submit"
              style={{ padding: '0.6rem', backgroundColor: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Plus size={16} />
              Add New Series
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {seriesList.map((s) => (
              <div key={s.seriesId} style={{ backgroundColor: 'var(--bg-main)', padding: '0.6rem 0.85rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</span>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>[{s.shortCode}]</span>
              </div>
            ))}
          </div>
        </div>

        {/* Manage Sub-Series / Festivals */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Sub-Series / Festival Configuration
          </h2>

          <form onSubmit={handleAddSubSeries} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              required
              placeholder="Sub-Series Name (e.g. Janmashtami)"
              value={newSubSeriesName}
              onChange={(e) => setNewSubSeriesName(e.target.value)}
              style={{ width: '100%', padding: '0.65rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
            />
            <button
              type="submit"
              style={{ padding: '0.6rem', backgroundColor: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Plus size={16} />
              Add Sub-Series / Festival
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {subSeriesList.map((sub) => (
              <div key={sub.subSeriesId} style={{ backgroundColor: 'var(--bg-main)', padding: '0.6rem 0.85rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{sub.name}</span>
                <span style={{ color: sub.active ? 'var(--accent-primary)' : 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                  {sub.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
