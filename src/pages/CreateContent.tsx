import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import { useApp } from '../context/appContext';
import { WorkflowEngine } from '../services/workflowEngine';
import { ROUTES } from '../config/constants';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const CreateContent: React.FC = () => {
  const { currentUser } = useAuth();
  const { seriesList, subSeriesList, refreshData } = useApp();
  const navigate = useNavigate();

  const [seriesId, setSeriesId] = useState<number>(seriesList[0]?.seriesId || 1);
  const [subSeriesId, setSubSeriesId] = useState<number | undefined>(undefined);
  const [workingTitle, setWorkingTitle] = useState('');
  const [realLifeProblem, setRealLifeProblem] = useState('');
  const [mythologyStory, setMythologyStory] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!currentUser) return null;

  const availableSubSeries = subSeriesList.filter((s) => s.seriesId === Number(seriesId) && s.active);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!realLifeProblem.trim()) {
      setError('Real Life Problem statement is mandatory.');
      return;
    }

    try {
      const created = await WorkflowEngine.createIdea(currentUser, {
        seriesId: Number(seriesId),
        subSeriesId: subSeriesId ? Number(subSeriesId) : undefined,
        workingTitle: workingTitle.trim() || undefined,
        realLifeProblem: realLifeProblem.trim(),
        mythologyStory: mythologyStory.trim() || undefined,
      });

      await refreshData();
      navigate(ROUTES.CONTENT_DETAIL.replace(':id', String(created.contentId)));
    } catch (err: any) {
      setError(err.message || 'Failed to create idea.');
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          alignSelf: 'flex-start',
          background: 'none',
          border: 'none',
          color: 'var(--accent-primary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.875rem',
        }}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Create New Content Idea
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Initiate a reel idea into the Manager Review approval queue.
            </p>
          </div>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--danger)',
              borderRadius: '6px',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              color: 'var(--danger)',
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Primary Series *
            </label>
            <select
              value={seriesId}
              onChange={(e) => {
                setSeriesId(Number(e.target.value));
                setSubSeriesId(undefined);
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            >
              {seriesList.map((s) => (
                <option key={s.seriesId} value={s.seriesId}>
                  [{s.shortCode}] {s.name}
                </option>
              ))}
            </select>
          </div>

          {availableSubSeries.length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Sub-Series / Festival (Optional)
              </label>
              <select
                value={subSeriesId || ''}
                onChange={(e) => setSubSeriesId(e.target.value ? Number(e.target.value) : undefined)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              >
                <option value="">None (Standalone)</option>
                {availableSubSeries.map((sub) => (
                  <option key={sub.subSeriesId} value={sub.subSeriesId}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Working Title (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Overcoming Work Anger"
              value={workingTitle}
              onChange={(e) => setWorkingTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Real Life Problem Statement *
            </label>
            <textarea
              rows={4}
              placeholder="Describe the real-life struggle or modern scenario this reel addresses..."
              value={realLifeProblem}
              onChange={(e) => setRealLifeProblem(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Mythology / Historical Reference (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Scripture reference, character story, or ancient wisdom parallel..."
              value={mythologyStory}
              onChange={(e) => setMythologyStory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
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
              marginTop: '0.5rem',
              cursor: 'pointer',
            }}
          >
            Create Idea & Send to Manager
          </button>
        </form>
      </div>
    </div>
  );
};
