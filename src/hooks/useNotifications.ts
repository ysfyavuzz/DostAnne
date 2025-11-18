import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { 
  requestNotificationPermissions,
  loadNotificationSettings,
  updateNotificationSettings,
  loadScheduledNotifications,
  scheduleFeedingReminders,
  scheduleSleepReminders,
  scheduleVaccineReminder,
  scheduleMedicalReminder,
  cancelNotification,
  cancelAllNotifications,
  getBadgeCount,
  setBadgeCount,
  clearError,
  updatePermissionStatus,
} from '../store/notificationSlice';
import { useEffect } from 'react';
import { notificationService } from '../services/NotificationService';

export const useNotifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector((state: RootState) => state.notifications);

  // Initialize notifications
  const initializeNotifications = async () => {
    try {
      const granted = await dispatch(requestNotificationPermissions()).unwrap();
      dispatch(updatePermissionStatus(granted));
      
      if (granted) {
        dispatch(loadNotificationSettings());
        dispatch(loadScheduledNotifications());
      }
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  };

  // Update settings
  const updateSettings = (settings: Partial<typeof notifications.settings>) => {
    return dispatch(updateNotificationSettings(settings));
  };

  // Schedule reminders
  const scheduleFeeding = (babyName: string, intervalHours: number = 3) => {
    return dispatch(scheduleFeedingReminders({ babyName, intervalHours }));
  };

  const scheduleSleep = (babyName: string) => {
    return dispatch(scheduleSleepReminders(babyName));
  };

  const scheduleVaccine = (vaccineName: string, babyName: string, dueDate: Date) => {
    return dispatch(scheduleVaccineReminder({ vaccineName, babyName, dueDate }));
  };

  const scheduleMedical = (appointmentDate: Date, doctorName: string, babyName: string) => {
    return dispatch(scheduleMedicalReminder({ appointmentDate, doctorName, babyName }));
  };

  // Cancel notifications
  const cancelScheduled = (notificationId: string) => {
    return dispatch(cancelNotification(notificationId));
  };

  const cancelAllScheduled = () => {
    return dispatch(cancelAllNotifications());
  };

  // Badge management
  const updateBadgeCount = (count: number) => {
    return dispatch(setBadgeCount(count));
  };

  const fetchBadgeCount = () => {
    return dispatch(getBadgeCount());
  };

  // Clear error
  const clearNotificationError = () => {
    dispatch(clearError());
  };

  // Quick notification methods
  const showFeedingStarted = (babyName: string) => {
    notificationService.notifyFeedingStarted(babyName);
  };

  const showSleepStarted = (babyName: string) => {
    notificationService.notifySleepStarted(babyName);
  };

  const showSleepEnded = (babyName: string, duration: string) => {
    notificationService.notifySleepEnded(babyName, duration);
  };

  const showFeedingEnded = (babyName: string, duration: string) => {
    notificationService.notifyFeedingEnded(babyName, duration);
  };

  const showVaccineGiven = (vaccineName: string, babyName: string) => {
    notificationService.notifyVaccineGiven(vaccineName, babyName);
  };

  const showGrowthRecordSaved = (babyName: string) => {
    notificationService.notifyGrowthRecordSaved(babyName);
  };

  // Auto-initialize on hook mount
  useEffect(() => {
    initializeNotifications();
  }, []);

  return {
    // State
    ...notifications,
    
    // Initialization
    initializeNotifications,
    
    // Settings
    updateSettings,
    
    // Scheduling
    scheduleFeeding,
    scheduleSleep,
    scheduleVaccine,
    scheduleMedical,
    
    // Canceling
    cancelScheduled,
    cancelAllScheduled,
    
    // Badge
    updateBadgeCount,
    fetchBadgeCount,
    
    // Quick notifications
    showFeedingStarted,
    showSleepStarted,
    showSleepEnded,
    showFeedingEnded,
    showVaccineGiven,
    showGrowthRecordSaved,
    
    // Utility
    clearNotificationError,
  };
};

// Custom hooks for specific data
export const useNotificationSettings = () => {
  const notifications = useSelector((state: RootState) => state.notifications);
  return notifications.settings;
};

export const useScheduledNotifications = () => {
  const notifications = useSelector((state: RootState) => state.notifications);
  return notifications.scheduledNotifications;
};

export const useNotificationPermissions = () => {
  const notifications = useSelector((state: RootState) => state.notifications);
  return notifications.permissionGranted;
};