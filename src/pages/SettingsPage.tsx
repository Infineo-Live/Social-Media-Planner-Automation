import React, { useState } from 'react';
import { useAuth } from '../auth/authContext';
import { useApp } from '../context/appContext';
import { useToast } from '../context/ToastContext';
import { dataRepository } from '../repositories/dataRepository';
import { Series, SubSeries } from '../types/content';
import { Plus } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { seriesList, subSeriesList, refreshData } = useApp();
  const { showToast } = useToast();

  const [newSeriesName, setNewSeriesName] = useState('');
  const [newSeriesCode, setNewSeriesCode] = useState('');
  const [newSubSeriesName, setNewSubSeriesName] = useState('');

  const [editingSeriesId, setEditingSeriesId] = useState<number | null>(null);
  const [editSeriesName, setEditSeriesName] = useState('');
  const [editSeriesCode, setEditSeriesCode] = useState('');

  const [editingSubSeriesId, setEditingSubSeriesId] = useState<number | null>(null);
  const [editSubSeriesName, setEditSubSeriesName] = useState('');

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

  const handleToggleSeriesActive = async (series: Series) => {
    try {
      await dataRepository.updateSeries(series.seriesId, { active: !series.active });
      showToast(`Series '${series.name}' ${!series.active ? 'enabled' : 'disabled'}.`, 'success');
      await refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update series.', 'error');
    }
  };

  const handleSaveSeriesEdit = async (seriesId: number) => {
    try {
      await dataRepository.updateSeries(seriesId, {
        name: editSeriesName.trim(),
        shortCode: editSeriesCode.trim().toUpperCase(),
      });
      setEditingSeriesId(null);
      showToast('Series updated successfully!', 'success');
      await refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update series.', 'error');
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

  const handleToggleSubSeriesActive = async (subSeries: SubSeries) => {
    try {
      await dataRepository.updateSubSeries(subSeries.subSeriesId, { active: !subSeries.active });
      showToast(`Sub-Series '${subSeries.name}' ${!subSeries.active ? 'enabled' : 'disabled'}.`, 'success');
      await refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update sub-series.', 'error');
    }
  };

  const handleSaveSubSeriesEdit = async (subSeriesId: number) => {
    try {
      await dataRepository.updateSubSeries(subSeriesId, {
        name: editSubSeriesName.trim(),
      });
      setEditingSubSeriesId(null);
      showToast('Sub-Series updated successfully!', 'success');
      await refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update sub-series.', 'error');
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
              <div key={s.seriesId} style={{ backgroundColor: 'var(--bg-main)', padding: '0.6rem 0.85rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.85rem' }}>
                {editingSeriesId === s.seriesId ? (
                  <div style={{ display: 'flex', gap: '0.35rem', flex: 1, alignItems: 'center' }}>
                    <input
                      type="text"
                      value={editSeriesName}
                      onChange={(e) => setEditSeriesName(e.target.value)}
                      style={{ flex: 2, padding: '0.3rem 0.5rem', fontSize: '0.85rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                    />
                    <input
                      type="text"
                      value={editSeriesCode}
                      onChange={(e) => setEditSeriesCode(e.target.value)}
                      style={{ width: '60px', padding: '0.3rem 0.5rem', fontSize: '0.85rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                    />
                    <button
                      onClick={() => handleSaveSeriesEdit(s.seriesId)}
                      style={{ padding: '0.3rem 0.6rem', backgroundColor: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingSeriesId(null)}
                      style={{ padding: '0.3rem 0.6rem', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 600, color: s.active ? 'var(--text-primary)' : 'var(--text-muted)', textDecoration: s.active ? 'none' : 'line-through' }}>{s.name}</span>
                      <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>[{s.shortCode}]</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          setEditingSeriesId(s.seriesId);
                          setEditSeriesName(s.name);
                          setEditSeriesCode(s.shortCode);
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleSeriesActive(s)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: s.active ? 'var(--danger)' : 'var(--accent-primary)',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {s.active ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </>
                )}
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
              <div key={sub.subSeriesId} style={{ backgroundColor: 'var(--bg-main)', padding: '0.6rem 0.85rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.85rem' }}>
                {editingSubSeriesId === sub.subSeriesId ? (
                  <div style={{ display: 'flex', gap: '0.35rem', flex: 1, alignItems: 'center' }}>
                    <input
                      type="text"
                      value={editSubSeriesName}
                      onChange={(e) => setEditSubSeriesName(e.target.value)}
                      style={{ flex: 1, padding: '0.3rem 0.5rem', fontSize: '0.85rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                    />
                    <button
                      onClick={() => handleSaveSubSeriesEdit(sub.subSeriesId)}
                      style={{ padding: '0.3rem 0.6rem', backgroundColor: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingSubSeriesId(null)}
                      style={{ padding: '0.3rem 0.6rem', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span style={{ fontWeight: 600, color: sub.active ? 'var(--text-primary)' : 'var(--text-muted)', textDecoration: sub.active ? 'none' : 'line-through' }}>{sub.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          setEditingSubSeriesId(sub.subSeriesId);
                          setEditSubSeriesName(sub.name);
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleSubSeriesActive(sub)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: sub.active ? 'var(--danger)' : 'var(--accent-primary)',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {sub.active ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
