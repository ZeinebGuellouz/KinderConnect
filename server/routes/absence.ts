import { RequestHandler } from "express";
import { AbsenceRecord, AbsenceNotification, CreateAbsenceRequest, AbsenceResponse, NotificationResponse } from "@shared/absence";
import { setAbsenceRecords } from "./attendance";

// In-memory storage for this session (in a real app, this would use a database)
let absenceRecords: AbsenceRecord[] = [];
let absenceNotifications: AbsenceNotification[] = [];

// Create absence record
export const createAbsence: RequestHandler = (req, res) => {
  try {
    const { childId, dates, reason, isRecurring }: CreateAbsenceRequest = req.body;

    if (!childId || !dates || dates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: childId and dates'
      } as AbsenceResponse);
    }

    // Get parent info (demo data)
    const parentData = {
      parentId: 'parent123',
      name: 'Sarah Johnson',
      children: [
        { id: 'child-1', name: 'Emma Johnson', class: 'Rainbow Class' },
        { id: 'child-2', name: 'Liam Johnson', class: 'Sunshine Class' }
      ]
    };

    const child = parentData.children.find(c => c.id === childId);
    if (!child) {
      return res.status(404).json({
        success: false,
        error: 'Child not found'
      } as AbsenceResponse);
    }

    // Create absence records for each date
    const newAbsences: AbsenceRecord[] = dates.map(date => ({
      id: `absence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      childId,
      childName: child.name,
      parentId: parentData.parentId,
      parentName: parentData.name,
      date,
      reason,
      isRecurring,
      recurringDates: isRecurring ? dates : undefined,
      notificationSent: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    // Add to in-memory storage
    absenceRecords.push(...newAbsences);

    // Update attendance module with new absence data
    setAbsenceRecords(absenceRecords);

    // Create notifications for admin
    const notifications: AbsenceNotification[] = newAbsences.map(absence => ({
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      absenceId: absence.id,
      childName: absence.childName,
      parentName: absence.parentName,
      date: absence.date,
      reason: absence.reason,
      isRead: false,
      createdAt: new Date().toISOString()
    }));

    absenceNotifications.push(...notifications);

    console.log(`✅ Created ${newAbsences.length} absence records for ${child.name}`);
    console.log(`✅ Generated ${notifications.length} admin notifications`);
    console.log('📋 Total absences now:', absenceRecords.length);
    console.log('🔔 Total notifications now:', absenceNotifications.length);

    res.json({
      success: true,
      absenceRecord: newAbsences[0] // Return first record as representative
    } as AbsenceResponse);

  } catch (error) {
    console.error('❌ Error creating absence:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as AbsenceResponse);
  }
};

// Get absence records for a child
export const getChildAbsences: RequestHandler = (req, res) => {
  try {
    const { childId } = req.params;

    if (!childId) {
      return res.status(400).json({
        success: false,
        error: 'Child ID is required'
      });
    }

    const childAbsences = absenceRecords.filter(absence => absence.childId === childId);
    
    console.log(`📋 Found ${childAbsences.length} absences for child ${childId}`);

    res.json({
      success: true,
      absences: childAbsences
    });

  } catch (error) {
    console.error('❌ Error getting child absences:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get all absence notifications for admin
export const getAbsenceNotifications: RequestHandler = (req, res) => {
  try {
    console.log(`🔔 Admin requesting notifications. Total: ${absenceNotifications.length}`);
    
    const sortedNotifications = absenceNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.json({
      success: true,
      notifications: sortedNotifications
    } as NotificationResponse);

  } catch (error) {
    console.error('❌ Error getting notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as NotificationResponse);
  }
};

// Mark notification as read
export const markNotificationRead: RequestHandler = (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = absenceNotifications.find(n => n.id === notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    notification.isRead = true;
    
    console.log(`✅ Marked notification ${notificationId} as read`);

    res.json({
      success: true,
      notifications: absenceNotifications
    } as NotificationResponse);

  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
