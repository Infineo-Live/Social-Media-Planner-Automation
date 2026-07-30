import React from 'react';
import { WorkflowStatus } from '../types/content';

interface StatusBadgeProps {
  status: WorkflowStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgColor = '#334155';
  let textColor = '#f8fafc';

  if (status.includes('Idea')) {
    bgColor = 'rgba(148, 163, 184, 0.2)';
    textColor = '#94a3b8';
  } else if (status.includes('Script WIP')) {
    bgColor = 'rgba(59, 130, 246, 0.2)';
    textColor = '#60a5fa';
  } else if (status.includes('Script Review') || status.includes('Idea Review') || status.includes('Reel Review')) {
    bgColor = 'rgba(245, 158, 11, 0.2)';
    textColor = '#fbbf24';
  } else if (status.includes('Reel WIP')) {
    bgColor = 'rgba(168, 85, 247, 0.2)';
    textColor = '#c084fc';
  } else if (status.includes('Metadata Completion')) {
    bgColor = 'rgba(236, 72, 153, 0.2)';
    textColor = '#f472b6';
  } else if (status === 'Completed') {
    bgColor = 'rgba(16, 185, 129, 0.2)';
    textColor = '#34d399';
  } else if (status === 'Scheduled') {
    bgColor = 'rgba(99, 102, 241, 0.2)';
    textColor = '#818cf8';
  } else if (status === 'Uploaded') {
    bgColor = 'rgba(6, 182, 212, 0.2)';
    textColor = '#22d3ee';
  }

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.25rem 0.65rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: bgColor,
        color: textColor,
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
};
