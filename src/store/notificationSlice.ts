import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { notificationService, NotificationSettings, ScheduledNotification } from '../services/NotificationService';

interface NotificationState {
  settings: NotificationSettings;
  scheduledNotifications: ScheduledNotification[];
  permissionGranted: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  settings: {
    feedingReminders: true,
    sleepReminders: true,
    vaccineReminders: true,
    diaperReminders: false,
    medicalReminders: true,
    feedingInterval: 3,
    sleepTarget: 14,
  },
  scheduledNotifications: [],
  permissionGranted: false,
  loading: false,
  error: null,
};

// Async thunks for notification operations
export const requestNotificationPermissions = createAsyncThunk(
  'notifications/requestPermissions',
  async () => {
    const granted = await notificationService.requestPermissions();
    return granted;
  }
);

export const loadNotificationSettings = createAsyncThunk(
  'notifications/loadSettings',
  async () => {
    const settings = await notificationService.getNotificationSettings();
    return settings;
  }
);

export const updateNotificationSettings = createAsyncThunk(
  'notifications/updateSettings',
  async (settings: Partial<NotificationSettings>) => {
    await notificationService.updateNotificationSettings(settings);
    const updatedSettings = await notificationService.getNotificationSettings();
    return updatedSettings;
  }
);

export const loadScheduledNotifications = createAsyncThunk(
  'notifications/loadScheduled',
  async () => {
    const notifications = await notificationService.getScheduledNotifications();
    return notifications;
  }
);

export const scheduleFeedingReminders = createAsyncThunk(
  'notifications/scheduleFeeding',
  async ({ babyName, intervalHours }: { babyName: string; intervalHours: number }) => {
    const notificationIds = await notificationService.scheduleFeedingReminders(babyName, intervalHours);
    const notifications = await notificationService.getScheduledNotifications();
    return { notifications, notificationIds };
  }
);

export const scheduleSleepReminders = createAsyncThunk(
  'notifications/scheduleSleep',
  async (babyName: string) => {
    const notificationIds = await notificationService.scheduleSleepReminders(babyName);
    const notifications = await notificationService.getScheduledNotifications();
    return { notifications, notificationIds };
  }
);

export const scheduleVaccineReminder = createAsyncThunk(
  'notifications/scheduleVaccine',
  async ({ vaccineName, babyName, dueDate }: { 
    vaccineName: string; 
    babyName: string; 
    dueDate: Date 
  }) => {
    const notificationId = await notificationService.scheduleVaccineReminder(vaccineName, babyName, dueDate);
    const notifications = await notificationService.getScheduledNotifications();
    return { notifications, notificationId };
  }
);

export const scheduleMedicalReminder = createAsyncThunk(
  'notifications/scheduleMedical',
  async ({ appointmentDate, doctorName, babyName }: { 
    appointmentDate: Date; 
    doctorName: string; 
    babyName: string 
  }) => {
    const notificationId = await notificationService.scheduleMedicalReminder(appointmentDate, doctorName, babyName);
    const notifications = await notificationService.getScheduledNotifications();
    return { notifications, notificationId };
  }
);

export const cancelNotification = createAsyncThunk(
  'notifications/cancel',
  async (notificationId: string) => {
    await notificationService.cancelNotification(notificationId);
    const notifications = await notificationService.getScheduledNotifications();
    return notifications;
  }
);

export const cancelAllNotifications = createAsyncThunk(
  'notifications/cancelAll',
  async () => {
    await notificationService.cancelAllNotifications();
    return [];
  }
);

export const getBadgeCount = createAsyncThunk(
  'notifications/getBadgeCount',
  async () => {
    const count = await notificationService.getBadgeCount();
    return count;
  }
);

export const setBadgeCount = createAsyncThunk(
  'notifications/setBadgeCount',
  async (count: number) => {
    await notificationService.setBadgeCount(count);
    return count;
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addLocalNotification: (state, action: PayloadAction<ScheduledNotification>) => {
      state.scheduledNotifications.push(action.payload);
    },
    removeLocalNotification: (state, action: PayloadAction<string>) => {
      state.scheduledNotifications = state.scheduledNotifications.filter(
        n => n.id !== action.payload
      );
    },
    updatePermissionStatus: (state, action: PayloadAction<boolean>) => {
      state.permissionGranted = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Permissions
    builder
      .addCase(requestNotificationPermissions.fulfilled, (state, action) => {
        state.permissionGranted = action.payload;
      });

    // Settings
    builder
      .addCase(loadNotificationSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      });

    // Scheduled Notifications
    builder
      .addCase(loadScheduledNotifications.fulfilled, (state, action) => {
        state.scheduledNotifications = action.payload;
      })
      .addCase(scheduleFeedingReminders.fulfilled, (state, action) => {
        state.scheduledNotifications = action.payload.notifications;
      })
      .addCase(scheduleSleepReminders.fulfilled, (state, action) => {
        state.scheduledNotifications = action.payload.notifications;
      })
      .addCase(scheduleVaccineReminder.fulfilled, (state, action) => {
        state.scheduledNotifications = action.payload.notifications;
      })
      .addCase(scheduleMedicalReminder.fulfilled, (state, action) => {
        state.scheduledNotifications = action.payload.notifications;
      })
      .addCase(cancelNotification.fulfilled, (state, action) => {
        state.scheduledNotifications = action.payload;
      })
      .addCase(cancelAllNotifications.fulfilled, (state, action) => {
        state.scheduledNotifications = action.payload;
      });

    // Badge Count
    builder.addCase(getBadgeCount.fulfilled, (state, action) => {
      // Badge count is handled externally, just for logging
    });

    // Error handling
    builder
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Notification operation failed';
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export const { 
  clearError, 
  addLocalNotification, 
  removeLocalNotification,
  updatePermissionStatus,
} = notificationSlice.actions;

export default notificationSlice.reducer;