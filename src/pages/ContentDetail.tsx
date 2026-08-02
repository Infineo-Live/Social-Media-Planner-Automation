import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import { useApp } from '../context/appContext';
import { dataRepository } from '../repositories/dataRepository';
import { WorkflowEngine } from '../services/workflowEngine';
import { PermissionService } from '../auth/permissionService';
import { ContentItem, PlatformChecklist, PublishingMetadata } from '../types/content';
import { ActivityLogItem } from '../types/activity';
import { User } from '../types/user';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { ROUTES } from '../config/constants';
import { formatDate, formatDateTime } from '../utils/dateUtils';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  ExternalLink,
  Save,
  Clock,
  UserCheck,
} from 'lucide-react';

export const ContentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { seriesList, subSeriesList, refreshData } = useApp();
  const { showToast } = useToast();

  const [item, setItem] = useState<ContentItem | null>(null);
  const [activities, setActivities] = useState<ActivityLogItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [canvaInput, setCanvaInput] = useState<string>('');
  const [episodeInput, setEpisodeInput] = useState<number | ''>('');
  const [scheduledState, setScheduledState] = useState<PlatformChecklist>({
    YouTube: false,
    Instagram: false,
    LinkedIn: false,
    Twitter: false,
  });
  const [uploadedState, setUploadedState] = useState<PlatformChecklist>({
    YouTube: false,
    Instagram: false,
    LinkedIn: false,
    Twitter: false,
  });
  const [metadataState, setMetadataState] = useState<PublishingMetadata>({
    youtubeTitle: '',
    youtubeDescription: '',
    youtubeTags: '',
    instagramCaption: '',
    instagramPoll: '',
    linkedInCaption: '',
    twitterCaption: '',
  });

  const loadDetail = async () => {
    if (!id) return;
    setLoading(true);
    const contentId = Number(id);
    const content = await dataRepository.getContentItemById(contentId);
    if (content) {
      setItem(content);
      setCanvaInput(content.currentCanvaLink || '');
      setEpisodeInput(content.episodeNumber ?? '');
      setMetadataState(content.metadata);
      setScheduledState(content.scheduled);
      setUploadedState(content.uploaded);

      const [logs, uList] = await Promise.all([
        dataRepository.getActivityLogs(contentId),
        dataRepository.getUsers(),
      ]);
      setActivities(logs);
      setUsers(uList);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDetail();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading content details..." />;
  if (!item || !currentUser) return <div>Content Item not found.</div>;

  const currentSeries = seriesList.find((s) => s.seriesId === item.seriesId);
  const currentSubSeries = subSeriesList.find((s) => s.subSeriesId === item.subSeriesId);
  const availableSubSeries = subSeriesList.filter(
    (s) => s.active || s.subSeriesId === item.subSeriesId
  );
  const assignedUser = users.find((u) => u.userId === item.assignedUserId);
  const creatorUser = users.find((u) => u.userId === item.createdByUserId);

  // Workflow Handlers
  const handleApprove = async () => {
    try {
      if (item.currentStatus === 'Idea Review (Manager)') {
        await WorkflowEngine.approveIdeaManager(currentUser, item.contentId);
      } else if (item.currentStatus === 'Idea Review (Admin)') {
        await WorkflowEngine.approveIdeaAdmin(currentUser, item.contentId);
      } else if (item.currentStatus === 'Script Review (Manager)') {
        await WorkflowEngine.approveScriptManager(currentUser, item.contentId);
      } else if (item.currentStatus === 'Script Review (Admin)') {
        await WorkflowEngine.approveScriptAdmin(currentUser, item.contentId);
      } else if (item.currentStatus === 'Reel Review (Manager)') {
        await WorkflowEngine.approveReelManager(currentUser, item.contentId);
      } else if (item.currentStatus === 'Reel Review (Admin)') {
        await WorkflowEngine.approveReelAdmin(currentUser, item.contentId);
      }
      showToast('Stage approved successfully!', 'success');
      await refreshData();
      await loadDetail();
    } catch (err: any) {
      showToast(err.message || 'Failed to approve item.', 'error');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      showToast('Please provide a reason for rejection.', 'info');
      return;
    }
    try {
      if (item.currentStatus === 'Idea Review (Manager)') {
        await WorkflowEngine.rejectIdeaManager(currentUser, item.contentId, rejectionReason);
      } else if (item.currentStatus === 'Idea Review (Admin)') {
        await WorkflowEngine.rejectIdeaAdmin(currentUser, item.contentId, rejectionReason);
      } else if (item.currentStatus === 'Script Review (Manager)') {
        await WorkflowEngine.rejectScriptManager(currentUser, item.contentId, rejectionReason);
      } else if (item.currentStatus === 'Script Review (Admin)') {
        await WorkflowEngine.rejectScriptAdmin(currentUser, item.contentId, rejectionReason);
      } else if (item.currentStatus === 'Reel Review (Manager)') {
        await WorkflowEngine.rejectReelManager(currentUser, item.contentId, rejectionReason);
      } else if (item.currentStatus === 'Reel Review (Admin)') {
        await WorkflowEngine.rejectReelAdmin(currentUser, item.contentId, rejectionReason);
      }
      setShowRejectModal(false);
      setRejectionReason('');
      showToast('Stage returned for revision.', 'info');
      await refreshData();
      await loadDetail();
    } catch (err: any) {
      showToast(err.message || 'Failed to reject item.', 'error');
    }
  };

  const handleClaim = async () => {
    try {
      if (item.currentStatus === 'Script WIP') {
        await WorkflowEngine.claimScript(currentUser, item.contentId);
      } else if (item.currentStatus === 'Reel WIP') {
        await WorkflowEngine.claimReel(currentUser, item.contentId);
      }
      showToast('Task claimed successfully!', 'success');
      await refreshData();
      await loadDetail();
    } catch (err: any) {
      showToast(err.message || 'Failed to claim task.', 'error');
    }
  };

  const handleSubmitScript = async () => {
    try {
      await WorkflowEngine.submitScript(currentUser, item.contentId);
      showToast('Script submitted for review!', 'success');
      await refreshData();
      await loadDetail();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit script.', 'error');
    }
  };

  const handleSubmitReel = async () => {
    try {
      await WorkflowEngine.submitReel(currentUser, item.contentId, canvaInput);
      showToast('Reel submitted for review!', 'success');
      await refreshData();
      await loadDetail();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit reel.', 'error');
    }
  };

  const handleSaveMetadata = async () => {
    try {
      await WorkflowEngine.completeMetadata(currentUser, item.contentId, metadataState);
      showToast('Metadata saved and reel finalized!', 'success');
      await refreshData();
      await loadDetail();
    } catch (err: any) {
      showToast(err.message || 'Failed to complete metadata.', 'error');
    }
  };

  const handleSaveScheduling = async () => {
    if (!episodeInput || Number(episodeInput) <= 0) {
      showToast('Valid Episode Number is required for scheduling.', 'error');
      return;
    }
    try {
      await WorkflowEngine.updateScheduling(
        currentUser,
        item.contentId,
        Number(episodeInput),
        scheduledState
      );
      showToast('Scheduling status updated!', 'success');
      await refreshData();
      await loadDetail();
    } catch (err: any) {
      showToast(err.message || 'Failed to save scheduling.', 'error');
    }
  };

  const handleSaveUploads = async () => {
    try {
      await WorkflowEngine.updateUploads(currentUser, item.contentId, uploadedState);
      showToast('Upload status updated!', 'success');
      await refreshData();
      await loadDetail();
    } catch (err: any) {
      showToast(err.message || 'Failed to save uploads.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Navigation */}
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
        Back to list
      </button>

      {/* Header Banner */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>#{item.contentId}</span>
            <StatusBadge status={item.currentStatus} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
              [{currentSeries?.shortCode}] {currentSeries?.name}
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {item.workingTitle || item.realLifeProblem}
          </h1>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Assigned to:{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {assignedUser ? assignedUser.fullName : 'Unassigned (Available to claim)'}
            </strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Claim Button */}
          {!item.assignedUserId &&
            (item.currentStatus === 'Script WIP' || item.currentStatus === 'Reel WIP') && (
              <button
                onClick={handleClaim}
                style={{
                  padding: '0.6rem 1.2rem',
                  backgroundColor: 'var(--success)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <UserCheck size={18} />
                Claim Task
              </button>
            )}

          {/* Submit Script Button */}
          {item.currentStatus === 'Script WIP' &&
            item.assignedUserId === currentUser.userId && (
              <button
                onClick={handleSubmitScript}
                style={{
                  padding: '0.6rem 1.2rem',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Submit Script for Review
              </button>
            )}

          {/* Review Actions (Approve / Reject) */}
          {item.currentStatus.includes('Review') &&
            ((currentUser.role === 'Manager' && item.currentStatus.includes('Manager')) ||
              currentUser.role === 'Admin') && (
              <>
                <button
                  onClick={handleApprove}
                  style={{
                    padding: '0.6rem 1.2rem',
                    backgroundColor: 'var(--success)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <CheckCircle size={18} />
                  Approve Stage
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  style={{
                    padding: '0.6rem 1.2rem',
                    backgroundColor: 'var(--danger)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <XCircle size={18} />
                  Reject Stage
                </button>
              </>
            )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
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
              maxWidth: '460px',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Reject Stage — Return Task
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Please provide constructive rejection reasons or required edits:
            </p>
            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter feedback or revision notes..."
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                outline: 'none',
                marginBottom: '1.25rem',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setShowRejectModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--danger)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Info + Production / Metadata */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Section 1 & 2: Basic Info & Production */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '1.5rem',
            }}
          >
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Basic Information
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Series:</span>{' '}
                <strong style={{ color: 'var(--text-primary)' }}>{currentSeries?.name}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Sub-Series:</span>{' '}
                <select
                  value={item.subSeriesId ?? ''}
                  onChange={async (e) => {
                    const val = e.target.value ? Number(e.target.value) : undefined;
                    try {
                      const updated = await dataRepository.updateContentItem(item.contentId, { subSeriesId: val });
                      if (updated) setItem(updated);
                      showToast('Sub-Series updated successfully!', 'success');
                      await refreshData();
                    } catch (err: any) {
                      showToast(err.message || 'Failed to update sub-series.', 'error');
                    }
                  }}
                  style={{
                    marginLeft: '0.5rem',
                    padding: '0.3rem 0.5rem',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                  }}
                >
                  <option value="">None (Optional)</option>
                  {availableSubSeries.map((sub) => (
                    <option key={sub.subSeriesId} value={sub.subSeriesId}>
                      {sub.name} {!sub.active ? '(Inactive)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Real Life Problem:</span>
                <p style={{ color: 'var(--text-primary)', marginTop: '0.25rem', backgroundColor: 'var(--bg-main)', padding: '0.75rem', borderRadius: '6px' }}>
                  {item.realLifeProblem}
                </p>
              </div>
              {item.mythologyStory && (
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Mythology Story / Reference:</span>
                  <p style={{ color: 'var(--text-primary)', marginTop: '0.25rem', backgroundColor: 'var(--bg-main)', padding: '0.75rem', borderRadius: '6px' }}>
                    {item.mythologyStory}
                  </p>
                </div>
              )}
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Created by {creatorUser?.fullName} on {formatDate(item.createdAt)}
              </div>
            </div>
          </div>

          {/* Production Reel Link Section */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '1.5rem',
            }}
          >
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Production Link (Canva)
            </h2>
            {item.currentCanvaLink ? (
              <div style={{ marginBottom: '1rem' }}>
                <a
                  href={item.currentCanvaLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--accent-primary)',
                    fontWeight: 600,
                  }}
                >
                  <ExternalLink size={18} />
                  Open Reel in Canva
                </a>
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                No Canva link provided yet.
              </p>
            )}

            {item.currentStatus === 'Reel WIP' && item.assignedUserId === currentUser.userId && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="url"
                  placeholder="https://canva.com/design/..."
                  value={canvaInput}
                  onChange={(e) => setCanvaInput(e.target.value)}
                  style={{
                    padding: '0.65rem',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                  }}
                />
                <button
                  onClick={handleSubmitReel}
                  style={{
                    padding: '0.6rem',
                    backgroundColor: 'var(--accent-primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Save & Submit Reel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Metadata Form */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Publishing Metadata
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>YouTube Title</label>
              <input
                type="text"
                disabled={item.currentStatus !== 'Metadata Completion'}
                value={metadataState.youtubeTitle}
                onChange={(e) => setMetadataState({ ...metadataState, youtubeTitle: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>YouTube Description</label>
              <textarea
                rows={2}
                disabled={item.currentStatus !== 'Metadata Completion'}
                value={metadataState.youtubeDescription}
                onChange={(e) => setMetadataState({ ...metadataState, youtubeDescription: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instagram Caption</label>
              <textarea
                rows={2}
                disabled={item.currentStatus !== 'Metadata Completion'}
                value={metadataState.instagramCaption}
                onChange={(e) => setMetadataState({ ...metadataState, instagramCaption: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>LinkedIn Caption</label>
              <input
                type="text"
                disabled={item.currentStatus !== 'Metadata Completion'}
                value={metadataState.linkedInCaption}
                onChange={(e) => setMetadataState({ ...metadataState, linkedInCaption: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Twitter Caption</label>
              <input
                type="text"
                disabled={item.currentStatus !== 'Metadata Completion'}
                value={metadataState.twitterCaption}
                onChange={(e) => setMetadataState({ ...metadataState, twitterCaption: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
              />
            </div>

            {item.currentStatus === 'Metadata Completion' && (
              <button
                onClick={handleSaveMetadata}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.65rem',
                  backgroundColor: 'var(--success)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <Save size={18} />
                Complete Metadata & Finalize Reel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Section 5 & 6: Scheduling & Uploads (Manager/Admin) */}
      {(item.currentStatus === 'Completed' || item.currentStatus === 'Scheduled' || item.currentStatus === 'Uploaded') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Scheduling */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '1.5rem',
            }}
          >
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Scheduling Controls
            </h2>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Episode Number (Mandatory for Scheduling)
              </label>
              <input
                type="number"
                value={episodeInput}
                onChange={(e) => setEpisodeInput(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 42"
                style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {(['YouTube', 'Instagram', 'LinkedIn', 'Twitter'] as const).map((platform) => (
                <label key={platform} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <input
                    type="checkbox"
                    checked={scheduledState[platform]}
                    onChange={(e) => setScheduledState({ ...scheduledState, [platform]: e.target.checked })}
                  />
                  {platform} Scheduled
                </label>
              ))}
            </div>

            <button
              onClick={handleSaveScheduling}
              style={{
                width: '100%',
                padding: '0.6rem',
                backgroundColor: 'var(--accent-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Update Scheduling Status
            </button>
          </div>

          {/* Upload Status */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '1.5rem',
            }}
          >
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Upload Status
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {(['YouTube', 'Instagram', 'LinkedIn', 'Twitter'] as const).map((platform) => (
                <label key={platform} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <input
                    type="checkbox"
                    checked={uploadedState[platform]}
                    onChange={(e) => setUploadedState({ ...uploadedState, [platform]: e.target.checked })}
                  />
                  {platform} Uploaded
                </label>
              ))}
            </div>

            <button
              onClick={handleSaveUploads}
              style={{
                width: '100%',
                padding: '0.6rem',
                backgroundColor: '#22d3ee',
                color: '#0f172a',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Update Upload Status
            </button>
          </div>
        </div>
      )}

      {/* Section 7: Audit / Activity History Log */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '1.5rem',
        }}
      >
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Activity & Audit History
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {activities.map((act) => {
            const u = users.find((usr) => usr.userId === act.userId);
            return (
              <div
                key={act.activityId}
                style={{
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    {act.actionType}
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                    by {u ? u.fullName : `User #${act.userId}`}
                  </span>
                  {act.notes && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      "{act.notes}"
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={14} />
                  {formatDateTime(act.timestamp)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
