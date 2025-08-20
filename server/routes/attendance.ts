import { RequestHandler } from "express";
import { AttendanceStats, AttendanceRequest, AttendanceResponse } from "@shared/attendance";

// Import absence data from absence module
let absenceRecords: any[] = [];

// Get attendance statistics for a child
export const getChildAttendance: RequestHandler = (req, res) => {
  try {
    const { childId } = req.params;
    const { month, year } = req.query;

    if (!childId) {
      return res.status(400).json({
        success: false,
        error: 'Child ID is required'
      } as AttendanceResponse);
    }

    // Use current month/year if not specified
    const targetDate = new Date();
    const targetMonth = month ? parseInt(month as string) : targetDate.getMonth();
    const targetYear = year ? parseInt(year as string) : targetDate.getFullYear();

    // Calculate total working days in the month (excluding weekends)
    const totalWorkingDays = getWorkingDaysInMonth(targetMonth, targetYear);
    
    // Get absence records for this child in this month
    const childAbsences = getAbsencesForChildInMonth(childId, targetMonth, targetYear);
    
    // Calculate stats
    const absentDays = childAbsences.length;
    const lateDays = 0; // For now, we don't track late arrivals
    const presentDays = Math.max(0, totalWorkingDays - absentDays);
    const attendancePercentage = totalWorkingDays > 0 ? Math.round((presentDays / totalWorkingDays) * 100) : 100;

    // Get child info
    const childInfo = getChildInfo(childId);

    const stats: AttendanceStats = {
      childId,
      childName: childInfo?.name || 'Unknown Child',
      month: targetMonth,
      year: targetYear,
      totalDays: totalWorkingDays,
      presentDays,
      absentDays,
      lateDays,
      attendancePercentage,
      absenceDates: childAbsences.map(absence => absence.date)
    };

    console.log(`📊 Attendance for ${stats.childName}: ${attendancePercentage}% (${presentDays}/${totalWorkingDays} days)`);

    res.json({
      success: true,
      stats
    } as AttendanceResponse);

  } catch (error) {
    console.error('❌ Error calculating attendance:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as AttendanceResponse);
  }
};

// Helper function to get working days in a month (excluding weekends)
function getWorkingDaysInMonth(month: number, year: number): number {
  const date = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0).getDate();
  let workingDays = 0;

  for (let day = 1; day <= lastDay; day++) {
    const currentDate = new Date(year, month, day);
    const dayOfWeek = currentDate.getDay();
    
    // Count Monday to Friday as working days (1-5)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      workingDays++;
    }
  }

  return workingDays;
}

// Helper function to get absences for a child in a specific month
function getAbsencesForChildInMonth(childId: string, month: number, year: number) {
  // Get absences from the current session's data
  // In a real app, this would query the database
  const allAbsences = getCurrentAbsences();
  
  return allAbsences.filter(absence => {
    if (absence.childId !== childId) return false;
    
    const absenceDate = new Date(absence.date);
    return absenceDate.getMonth() === month && absenceDate.getFullYear() === year;
  });
}

// Helper function to get current absences (import from absence module)
function getCurrentAbsences() {
  try {
    // This would normally import from the absence module
    // For now, return empty array as placeholder
    return absenceRecords;
  } catch {
    return [];
  }
}

// Helper function to get child info
function getChildInfo(childId: string) {
  // Demo data (in real app, this would come from database)
  const children = [
    { id: 'child-1', name: 'Emma Johnson', class: 'Rainbow Class' },
    { id: 'child-2', name: 'Liam Johnson', class: 'Sunshine Class' },
    { id: 'child-3', name: 'Alex Smith', class: 'Adventure Class' },
    { id: 'child-4', name: 'Sofia Garcia', class: 'Rainbow Class' },
    { id: 'child-5', name: 'Diego Garcia', class: 'Explorer Class' },
    { id: 'child-6', name: 'Carlos Garcia', class: 'Adventure Class' }
  ];
  
  return children.find(child => child.id === childId);
}

// Function to set absence records (called from absence module)
export function setAbsenceRecords(records: any[]) {
  absenceRecords = records;
}
