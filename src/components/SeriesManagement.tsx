import React, { useState } from 'react';
import { useAuth } from '../auth/authContext';
import { useApp } from '../context/appContext';
import { useToast } from '../context/ToastContext';
import { dataRepository } from '../repositories/dataRepository';
import { Series, SubSeries } from '../types/content';
import { Plus, Loader2 } from 'lucide-react';

export const SeriesManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const { seriesList, subSeriesList, refreshData } = useApp();
  const { showToast } = useToast();

  const [newSeriesName, setNewSeriesName] = useState('');
  const [newSeriesCode, setNewSeriesCode] = useState('');
  const [newSubSeriesName, setNewSubSeriesName] = useState('');

  const [isAddingSeries, setIsAddingSeries] = useState(false);
  const [isAddingSubSeries, setIsAddingSubSeries] = useState(false);
  const [isSavingSeries, setIsSavingSeries] = useState(false);
  const [isTogglingSeriesId, setIsTogglingSeriesId] = useState<number | null>(null);
  const [isSavingSubSeries, setIsSavingSubSeries] = useState(false);
  const [isTogglingSubSeriesId, setIsTogglingSubSeriesId] = useState<number | null>(null);

  const [editingSeriesId, setEditingSeriesId] = useState<number | null>(null);
  const [editSeriesName, setEditSeriesName] = useState('');
  const [editSeriesCode, setEditSeriesCode] = useState('');

  const [editingSubSeriesId, setEditingSubSeriesId] = useState<number | null>(null);
  const [editSubSeriesName, setEditSubSeriesName] = useState('');

  if (!currentUser || currentUser.role !== 'Admin') {
    return <div style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Access Denied. Admin privileges required.</div>;
  }

  const handleAddSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddingSeries) return;
    setIsAddingSeries(true);
    try {
      await dataRepository.addSeries({
        name: newSeriesName.trim(),
        shortCode: newSeriesCode.trim().toUpperCase(),
        active: true,
      });

      try {
        await refreshData();
      } catch (refreshErr: any) {
        setIsAddingSeries(false);
        showToast('Series created, but failed to refresh list.', 'error');
        return;
      }

      setIsAddingSeries(false);
      setNewSeriesName('');
      setNewSeriesCode('');
      showToast('Series added successfully!', 'success');
    } catch (err: any) {
      setIsAddingSeries(false);
      showToast(err.message || 'Failed to add series.', 'error');
    }
  };

  const handleToggleSeriesActive = async (series: Series) => {
    if (isTogglingSeriesId !== null) return;
    setIsTogglingSeriesId(series.seriesId);
    try {
      await dataRepository.updateSeries(series.seriesId, { active: !series.active });
      try {
        await refreshData();
      } catch {
        setIsTogglingSeriesId(null);
        showToast('Series updated, but failed to refresh list.', 'error');
        return;
      }
      setIsTogglingSeriesId(null);
      showToast(`Series '${series.name}' ${!series.active ? 'enabled' : 'disabled'}.`, 'success');
    } catch (err: any) {
      setIsTogglingSeriesId(null);
      showToast(err.message || 'Failed to update series.', 'error');
    }
  };

  const handleSaveSeriesEdit = async (seriesId: number) => {
    if (isSavingSeries) return;
    setIsSavingSeries(true);
    try {
      await dataRepository.updateSeries(seriesId, {
        name: editSeriesName.trim(),
        shortCode: editSeriesCode.trim().toUpperCase(),
      });
      try {
        await refreshData();
      } catch {
        setIsSavingSeries(false);
        showToast('Series updated, but failed to refresh list.', 'error');
        return;
      }
      setIsSavingSeries(false);
      setEditingSeriesId(null);
      showToast('Series updated successfully!', 'success');
    } catch (err: any) {
      setIsSavingSeries(false);
      showToast(err.message || 'Failed to update series.', 'error');
    }
  };

  const handleAddSubSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddingSubSeries) return;
    setIsAddingSubSeries(true);
    try {
      await dataRepository.addSubSeries({
        name: newSubSeriesName.trim(),
        active: true,
      });

      try {
        await refreshData();
      } catch (refreshErr: any) {
        setIsAddingSubSeries(false);
        showToast('Sub-Series created, but failed to refresh list.', 'error');
        return;
      }

      setIsAddingSubSeries(false);
      setNewSubSeriesName('');
      showToast('Sub-Series added successfully!', 'success');
    } catch (err: any) {
      setIsAddingSubSeries(false);
      showToast(err.message || 'Failed to add sub-series.', 'error');
    }
  };

  const handleToggleSubSeriesActive = async (subSeries: SubSeries) => {
    if (isTogglingSubSeriesId !== null) return;
    setIsTogglingSubSeriesId(subSeries.subSeriesId);
    try {
      await dataRepository.updateSubSeries(subSeries.subSeriesId, { active: !subSeries.active });
      try {
        await refreshData();
      } catch {
        setIsTogglingSubSeriesId(null);
        showToast('Sub-Series updated, but failed to refresh list.', 'error');
        return;
      }
      setIsTogglingSubSeriesId(null);
      showToast(`Sub-Series '${subSeries.name}' ${!subSeries.active ? 'enabled' : 'disabled'}.`, 'success');
    } catch (err: any) {
      setIsTogglingSubSeriesId(null);
      showToast(err.message || 'Failed to update sub-series.', 'error');
    }
  };

  const handleSaveSubSeriesEdit = async (subSeriesId: number) => {
    if (isSavingSubSeries) return;
    setIsSavingSubSeries(true);
    try {
      await dataRepository.updateSubSeries(subSeriesId, {
        name: editSubSeriesName.trim(),
      });
      try {
        await refreshData();
      } catch {
        setIsSavingSubSeries(false);
        showToast('Sub-Series updated, but failed to refresh list.', 'error');
        return;
      }
      setIsSavingSubSeries(false);
      setEditingSubSeriesId(null);
      showToast('Sub-Series updated successfully!', 'success');
    } catch (err: any) {
      setIsSavingSubSeries(false);
      showToast(err.message || 'Failed to update sub-series.', 'error');
    }
  };

  return (
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
            disabled={isAddingSeries}
            placeholder="Series Name (e.g. Neo Ki Paathshala)"
            value={newSeriesName}
            onChange={(e) => setNewSeriesName(e.target.value)}
            style={{ width: '100%', padding: '0.65rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
          />
          <input
            type="text"
            required
            disabled={isAddingSeries}
            placeholder="Short Code (e.g. NKPS)"
            value={newSeriesCode}
            onChange={(e) => setNewSeriesCode(e.target.value)}
            style={{ width: '100%', padding: '0.65rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
          />
          <button
            type="submit"
            disabled={isAddingSeries}
            style={{
              padding: '0.6rem',
              backgroundColor: 'var(--accent-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: isAddingSeries ? 'not-allowed' : 'pointer',
              opacity: isAddingSeries ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            {isAddingSeries ? (
              <>
                <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                Adding Series...
              </>
            ) : (
              <>
                <Plus size={16} />
                Add New Series
              </>
            )}
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
                    disabled={isSavingSeries}
                    style={{ padding: '0.3rem 0.6rem', backgroundColor: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: isSavingSeries ? 'not-allowed' : 'pointer', opacity: isSavingSeries ? 0.7 : 1, fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    {isSavingSeries ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : 'Save'}
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
                      disabled={isTogglingSeriesId === s.seriesId}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: s.active ? 'var(--danger)' : 'var(--accent-primary)',
                        cursor: isTogglingSeriesId === s.seriesId ? 'not-allowed' : 'pointer',
                        opacity: isTogglingSeriesId === s.seriesId ? 0.7 : 1,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      {isTogglingSeriesId === s.seriesId ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Working...</> : (s.active ? 'Disable' : 'Enable')}
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
            disabled={isAddingSubSeries}
            placeholder="Sub-Series Name (e.g. Janmashtami)"
            value={newSubSeriesName}
            onChange={(e) => setNewSubSeriesName(e.target.value)}
            style={{ width: '100%', padding: '0.65rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
          />
          <button
            type="submit"
            disabled={isAddingSubSeries}
            style={{
              padding: '0.6rem',
              backgroundColor: 'var(--accent-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: isAddingSubSeries ? 'not-allowed' : 'pointer',
              opacity: isAddingSubSeries ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            {isAddingSubSeries ? (
              <>
                <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                Adding Sub-Series...
              </>
            ) : (
              <>
                <Plus size={16} />
                Add Sub-Series / Festival
              </>
            )}
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
                    disabled={isSavingSubSeries}
                    style={{ padding: '0.3rem 0.6rem', backgroundColor: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: isSavingSubSeries ? 'not-allowed' : 'pointer', opacity: isSavingSubSeries ? 0.7 : 1, fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    {isSavingSubSeries ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : 'Save'}
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
                      disabled={isTogglingSubSeriesId === sub.subSeriesId}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: sub.active ? 'var(--danger)' : 'var(--accent-primary)',
                        cursor: isTogglingSubSeriesId === sub.subSeriesId ? 'not-allowed' : 'pointer',
                        opacity: isTogglingSubSeriesId === sub.subSeriesId ? 0.7 : 1,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      {isTogglingSubSeriesId === sub.subSeriesId ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Working...</> : (sub.active ? 'Disable' : 'Enable')}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
