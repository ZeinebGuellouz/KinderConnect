/**
 * Shared interfaces for absence management system
 */

export interface AbsenceRecord {
  id: string;
  childId: string;
  childName: string;
  parentId: string;
  parentName: string;
  date: string;
  reason?: string;
  isRecurring: boolean;
  recurringDates?: string[];
  notificationSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AbsenceNotification {
  id: string;
  absenceId: string;
  childName: string;
  parentName: string;
  date: string;
  reason?: string;
  isRead: boolean;
  createdAt: string;
}

export interface CreateAbsenceRequest {
  childId: string;
  dates: string[];
  reason?: string;
  isRecurring: boolean;
}

export interface AbsenceResponse {
  success: boolean;
  absenceRecord?: AbsenceRecord;
  error?: string;
}

export interface NotificationResponse {
  success: boolean;
  notifications?: AbsenceNotification[];
  error?: string;
}
