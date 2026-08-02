export type WorkflowStatus =
  | 'Idea'
  | 'Idea Review (Manager)'
  | 'Idea Review (Admin)'
  | 'Script WIP'
  | 'Script Review (Manager)'
  | 'Script Review (Admin)'
  | 'Reel WIP'
  | 'Reel Review (Manager)'
  | 'Reel Review (Admin)'
  | 'Metadata Completion'
  | 'Completed'
  | 'Scheduled'
  | 'Uploaded';

export type Platform = 'YouTube' | 'Instagram' | 'LinkedIn' | 'Twitter';

export interface Series {
  seriesId: number;
  name: string;
  shortCode: string;
  active: boolean;
  displayOrder?: number;
}

export interface SubSeries {
  subSeriesId: number;
  seriesId?: number;
  name: string;
  active: boolean;
  displayOrder?: number;
}

export interface PlatformChecklist {
  YouTube: boolean;
  Instagram: boolean;
  LinkedIn: boolean;
  Twitter: boolean;
}

export interface PublishingMetadata {
  youtubeTitle: string;
  youtubeDescription: string;
  youtubeTags: string;
  instagramCaption: string;
  instagramPoll: string;
  linkedInCaption: string;
  twitterCaption: string;
}

export interface ContentItem {
  contentId: number;
  seriesId: number;
  subSeriesId?: number;
  workingTitle?: string;
  realLifeProblem: string;
  mythologyStory?: string;
  episodeNumber?: number;
  currentStatus: WorkflowStatus;
  assignedUserId?: number;
  createdByUserId: number;
  currentCanvaLink?: string;
  metadata: PublishingMetadata;
  scheduled: PlatformChecklist;
  uploaded: PlatformChecklist;
  createdAt: string;
  updatedAt: string;
}
