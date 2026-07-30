export interface ActivityLogItem {
  activityId: number;
  timestamp: string;
  contentId: number;
  userId: number;
  actionType: string;
  previousStatus?: string;
  newStatus?: string;
  notes?: string;
}
