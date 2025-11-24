import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async (notification) => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowList: true, // Eksik property
    shouldShowBanner: true, // Eksik property
  }),
});

export interface NotificationSettings {
  feedingReminders: boolean;
  sleepReminders: boolean;
  vaccineReminders: boolean;
  diaperReminders: boolean;
  medicalReminders: boolean;
  feedingInterval: number; // hours
  sleepTarget: number; // hours
}

export interface ScheduledNotification {
  id: string;
  type: 'feeding' | 'sleep' | 'vaccine' | 'diaper' | 'medical';
  title: string;
  body: string;
  scheduledTime: Date;
  recurring?: boolean;
  interval?: number; // in minutes
}

class NotificationService {
  private static instance: NotificationService;
  private defaultSettings: NotificationSettings = {
    feedingReminders: true,
    sleepReminders: true,
    vaccineReminders: true,
    diaperReminders: false,
    medicalReminders: true,
    feedingInterval: 3,
    sleepTarget: 14,
  };

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await Notifications.requestPermissionsAsync();
        return status === 'granted';
      }
      return false;
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      return false;
    }
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const settings = await AsyncStorage.getItem('notificationSettings');
      return settings ? JSON.parse(settings) : this.defaultSettings;
    } catch (error) {
      console.error('Failed to get notification settings:', error);
      return this.defaultSettings;
    }
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<void> {
    try {
      const currentSettings = await this.getNotificationSettings();
      const newSettings = { ...currentSettings, ...settings };
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to update notification settings:', error);
    }
  }

  async scheduleNotification(notification: ScheduledNotification): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('Notification permissions not granted');
        return null;
      }

      const trigger = notification.recurring
        ? ({
            hour: notification.scheduledTime.getHours(),
            minute: notification.scheduledTime.getMinutes(),
            repeats: true,
          } as unknown as Notifications.DailyTriggerInput)
        : ({
            date: notification.scheduledTime,
          } as Notifications.DateTriggerInput);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: {
            type: notification.type,
            id: notification.id,
          },
          sound: 'default',
        },
        trigger,
      });

      // Store notification info for management
      await this.storeNotificationInfo(notificationId, notification);

      return notificationId;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return null;
    }
  }

  async scheduleFeedingReminders(babyName: string, intervalHours: number): Promise<string[]> {
    const settings = await this.getNotificationSettings();
    if (!settings.feedingReminders) return [];

    const notifications: string[] = [];
    const now = new Date();
    
    // Schedule 3 reminders per day at regular intervals
    for (let i = 0; i < 3; i++) {
      const scheduledTime = new Date(now);
      scheduledTime.setHours(8 + (i * intervalHours), 0, 0, 0); // 8 AM, 11 AM, 2 PM

      if (scheduledTime > now) {
        const notification: ScheduledNotification = {
          id: `feeding_${i}_${Date.now()}`,
          type: 'feeding',
          title: '🍼 Beslenme Zamanı!',
          body: `${babyName} için beslenme zamanı geldi`,
          scheduledTime,
          recurring: true,
        };

        const notificationId = await this.scheduleNotification(notification);
        if (notificationId) notifications.push(notificationId);
      }
    }

    return notifications;
  }

  async scheduleSleepReminders(babyName: string): Promise<string[]> {
    const settings = await this.getNotificationSettings();
    if (!settings.sleepReminders) return [];

    const notifications: string[] = [];
    const now = new Date();
    
    // Schedule bedtime reminder at 8 PM
    const bedtime = new Date(now);
    bedtime.setHours(20, 0, 0, 0);

    if (bedtime > now) {
      const notification: ScheduledNotification = {
        id: `sleep_bedtime_${Date.now()}`,
        type: 'sleep',
        title: '😴 Uyku Zamanı!',
        body: `${babyName} için uyku zamanı geldi`,
        scheduledTime: bedtime,
        recurring: true,
      };

      const notificationId = await this.scheduleNotification(notification);
      if (notificationId) notifications.push(notificationId);
    }

    return notifications;
  }

  async scheduleVaccineReminder(vaccineName: string, babyName: string, dueDate: Date): Promise<string | null> {
    const settings = await this.getNotificationSettings();
    if (!settings.vaccineReminders) return null;

    // Schedule reminder 1 day before and on the due date
    const reminderDate = new Date(dueDate);
    reminderDate.setDate(reminderDate.getDate() - 1);
    reminderDate.setHours(9, 0, 0, 0);

    const notification: ScheduledNotification = {
      id: `vaccine_${vaccineName}_${Date.now()}`,
      type: 'vaccine',
      title: '💉 Aşı Hatırlatıcısı',
      body: `${babyName} için ${vaccineName} aşısı yarın yapılacak`,
      scheduledTime: reminderDate,
    };

    return await this.scheduleNotification(notification);
  }

  async scheduleMedicalReminder(appointmentDate: Date, doctorName: string, babyName: string): Promise<string | null> {
    const settings = await this.getNotificationSettings();
    if (!settings.medicalReminders) return null;

    // Schedule reminder 1 hour before appointment
    const reminderDate = new Date(appointmentDate);
    reminderDate.setHours(reminderDate.getHours() - 1);

    const notification: ScheduledNotification = {
      id: `medical_${doctorName}_${Date.now()}`,
      type: 'medical',
      title: '🏥 Doktor Randevusu',
      body: `${babyName} için ${doctorName} randevusu 1 saat sonra`,
      scheduledTime: reminderDate,
    };

    return await this.scheduleNotification(notification);
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      await this.removeNotificationInfo(notificationId);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await AsyncStorage.removeItem('scheduledNotifications');
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
    }
  }

  async getScheduledNotifications(): Promise<ScheduledNotification[]> {
    try {
      const stored = await AsyncStorage.getItem('scheduledNotifications');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get scheduled notifications:', error);
      return [];
    }
  }

  async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Failed to get badge count:', error);
      return 0;
    }
  }

  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Failed to set badge count:', error);
    }
  }

  private async storeNotificationInfo(id: string, notification: ScheduledNotification): Promise<void> {
    try {
      const notifications = await this.getScheduledNotifications();
      notifications.push({ ...notification, id });
      await AsyncStorage.setItem('scheduledNotifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to store notification info:', error);
    }
  }

  private async removeNotificationInfo(id: string): Promise<void> {
    try {
      const notifications = await this.getScheduledNotifications();
      const filtered = notifications.filter(n => n.id !== id);
      await AsyncStorage.setItem('scheduledNotifications', JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove notification info:', error);
    }
  }

  // Quick notification methods for immediate alerts
  async showImmediateNotification(title: string, body: string, type?: string): Promise<void> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { type },
          sound: 'default',
        },
        trigger: null, // Immediate notification
      });
    } catch (error) {
      console.error('Failed to show immediate notification:', error);
    }
  }

  // Baby activity specific notifications
  async notifyFeedingStarted(babyName: string): Promise<void> {
    await this.showImmediateNotification(
      '🍼 Beslenme Başladı',
      `${babyName} için beslenme kaydı başlatıldı`,
      'feeding'
    );
  }

  async notifySleepStarted(babyName: string): Promise<void> {
    await this.showImmediateNotification(
      '😴 Uyku Başladı',
      `${babyName} için uyku takibi başlatıldı`,
      'sleep'
    );
  }

  async notifySleepEnded(babyName: string, duration: string): Promise<void> {
    await this.showImmediateNotification(
      '😊 Uyku Bitti',
      `${babyName} ${duration} uyudu`,
      'sleep'
    );
  }

  async notifyFeedingEnded(babyName: string, duration: string): Promise<void> {
    await this.showImmediateNotification(
      '🍼 Beslenme Bitti',
      `${babyName} için beslenme süresi: ${duration}`,
      'feeding'
    );
  }

  async notifyVaccineGiven(vaccineName: string, babyName: string): Promise<void> {
    await this.showImmediateNotification(
      '💉 Aşı Yapıldı',
      `${babyName} için ${vaccineName} aşısı başarıyla yapıldı`,
      'vaccine'
    );
  }

  async notifyGrowthRecordSaved(babyName: string): Promise<void> {
    await this.showImmediateNotification(
      '📏 Gelişim Kaydedildi',
      `${babyName} için gelişim verileri kaydedildi`,
      'growth'
    );
  }
}

export const notificationService = NotificationService.getInstance();
export default notificationService;