/**
 * Shared interfaces for attendance management system
 */

export interface AttendanceStats {
  childId: string;
  childName: string;
  month: number;
  year: number;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  attendancePercentage: number;
  absenceDates: string[];
}

export interface AttendanceRequest {
  childId: string;
  month?: number;
  year?: number;
}

export interface AttendanceResponse {
  success: boolean;
  stats?: AttendanceStats;
  error?: string;
}
