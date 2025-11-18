import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../hooks/useThemedStyles';

interface Reminder {
  id: string;
  title: string;
  time: string;
  days: number[]; // 0=Sunday, 1=Monday, etc.
  type: 'feeding' | 'sleep' | 'diaper' | 'medicine' | 'vaccine' | 'checkup' | 'custom';
  enabled: boolean;
  sound: boolean;
  vibrate: boolean;
}

interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibrate: boolean;
  badge: boolean;
  preview: boolean;
}

const reminderTypes = [
  { type: 'feeding' as const, icon: 'restaurant', label: 'Emzirme', color: '#FF6B9D' },
  { type: 'sleep' as const, icon: 'moon', label: 'Uyku', color: '#8B5CF6' },
  { type: 'diaper' as const, icon: 'water', label: 'Bez', color: '#10B981' },
  { type: 'medicine' as const, icon: 'medical', label: 'İlaç', color: '#EF4444' },
  { type: 'vaccine' as const, icon: 'fitness', label: 'Aşı', color: '#F59E0B' },
  { type: 'checkup' as const, icon: 'clipboard', label: 'Kontrol', color: '#3B82F6' },
  { type: 'custom' as const, icon: 'notifications', label: 'Özel', color: '#6B7280' },
];

const dayNames = ['Pzr', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

export default function NotificationsScreenNew() {
  const { colors, spacing, borderRadius, typography, shadows } = useThemedStyles();

  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    sound: true,
    vibrate: true,
    badge: true,
    preview: true,
  });

  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: 'Sabah Emzirme',
      time: '08:00',
      days: [1, 2, 3, 4, 5, 6, 0],
      type: 'feeding',
      enabled: true,
      sound: true,
      vibrate: true,
    },
    {
      id: '2',
      title: 'Vitamin D',
      time: '09:00',
      days: [1, 2, 3, 4, 5, 6, 0],
      type: 'medicine',
      enabled: true,
      sound: true,
      vibrate: false,
    },
    {
      id: '3',
      title: 'Öğle Uykusu',
      time: '13:00',
      days: [1, 2, 3, 4, 5],
      type: 'sleep',
      enabled: false,
      sound: true,
      vibrate: true,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: '',
    time: '09:00',
    days: [1, 2, 3, 4, 5, 6, 0],
    type: 'custom',
    enabled: true,
    sound: true,
    vibrate: true,
  });

  const toggleSetting = (key: keyof NotificationSettings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const toggleReminder = (id: string) => {
    setReminders(
      reminders.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      )
    );
  };

  const toggleReminderDay = (day: number) => {
    const days = newReminder.days || [];
    if (days.includes(day)) {
      setNewReminder({ ...newReminder, days: days.filter((d) => d !== day) });
    } else {
      setNewReminder({ ...newReminder, days: [...days, day].sort() });
    }
  };

  const handleAddReminder = () => {
    if (!newReminder.title || !newReminder.time) {
      Alert.alert('Hata', 'Lütfen başlık ve saat alanlarını doldurun');
      return;
    }

    if (!newReminder.days || newReminder.days.length === 0) {
      Alert.alert('Hata', 'Lütfen en az bir gün seçin');
      return;
    }

    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title!,
      time: newReminder.time!,
      days: newReminder.days!,
      type: newReminder.type as Reminder['type'],
      enabled: true,
      sound: newReminder.sound ?? true,
      vibrate: newReminder.vibrate ?? true,
    };

    setReminders([...reminders, reminder].sort((a, b) => a.time.localeCompare(b.time)));
    setNewReminder({
      title: '',
      time: '09:00',
      days: [1, 2, 3, 4, 5, 6, 0],
      type: 'custom',
      enabled: true,
      sound: true,
      vibrate: true,
    });
    setShowAddModal(false);
    Alert.alert('Başarılı', 'Hatırlatıcı eklendi');
  };

  const deleteReminder = (id: string) => {
    Alert.alert(
      'Hatırlatıcı Sil',
      'Bu hatırlatıcıyı silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => setReminders(reminders.filter((r) => r.id !== id)),
        },
      ]
    );
  };

  const getReminderTypeInfo = (type: Reminder['type']) => {
    return reminderTypes.find((t) => t.type === type) || reminderTypes[6];
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Header */}
      <LinearGradient
        colors={colors.gradients.primary}
        style={[styles.header, shadows.medium]}
      >
        <Ionicons name="notifications" size={48} color="white" />
        <Text style={[styles.headerTitle, typography.h1, { color: 'white' }]}>
          Bildirimler
        </Text>
        <Text style={[styles.headerSubtitle, typography.body, { color: 'white' }]}>
          Hatırlatıcılar ve bildirim ayarları
        </Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Notification Settings */}
        <View style={[styles.settingsCard, { backgroundColor: 'white' }, shadows.small]}>
          <Text style={[styles.sectionTitle, typography.h3, { color: colors.text }]}>
            Bildirim Ayarları
          </Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={24} color={colors.primary[500]} />
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, typography.bodyBold, { color: colors.text }]}>
                  Bildirimleri Aç
                </Text>
                <Text style={[styles.settingDescription, typography.caption, { color: colors.textSecondary }]}>
                  Tüm bildirimler
                </Text>
              </View>
            </View>
            <Switch
              value={settings.enabled}
              onValueChange={() => toggleSetting('enabled')}
              trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
              thumbColor={settings.enabled ? colors.primary[500] : colors.neutral[400]}
            />
          </View>

          <View style={[styles.settingItem, { opacity: settings.enabled ? 1 : 0.5 }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="volume-high-outline" size={24} color={colors.secondary[500]} />
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, typography.bodyBold, { color: colors.text }]}>
                  Ses
                </Text>
                <Text style={[styles.settingDescription, typography.caption, { color: colors.textSecondary }]}>
                  Bildirim sesi çal
                </Text>
              </View>
            </View>
            <Switch
              value={settings.sound}
              onValueChange={() => toggleSetting('sound')}
              disabled={!settings.enabled}
              trackColor={{ false: colors.neutral[300], true: colors.secondary[300] }}
              thumbColor={settings.sound ? colors.secondary[500] : colors.neutral[400]}
            />
          </View>

          <View style={[styles.settingItem, { opacity: settings.enabled ? 1 : 0.5 }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="phone-portrait-outline" size={24} color={colors.success[500]} />
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, typography.bodyBold, { color: colors.text }]}>
                  Titreşim
                </Text>
                <Text style={[styles.settingDescription, typography.caption, { color: colors.textSecondary }]}>
                  Telefon titresin
                </Text>
              </View>
            </View>
            <Switch
              value={settings.vibrate}
              onValueChange={() => toggleSetting('vibrate')}
              disabled={!settings.enabled}
              trackColor={{ false: colors.neutral[300], true: colors.success[300] }}
              thumbColor={settings.vibrate ? colors.success[500] : colors.neutral[400]}
            />
          </View>

          <View style={[styles.settingItem, { opacity: settings.enabled ? 1 : 0.5 }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="ellipse" size={24} color={colors.error[500]} />
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, typography.bodyBold, { color: colors.text }]}>
                  Badge
                </Text>
                <Text style={[styles.settingDescription, typography.caption, { color: colors.textSecondary }]}>
                  Uygulama simgesinde sayı göster
                </Text>
              </View>
            </View>
            <Switch
              value={settings.badge}
              onValueChange={() => toggleSetting('badge')}
              disabled={!settings.enabled}
              trackColor={{ false: colors.neutral[300], true: colors.error[300] }}
              thumbColor={settings.badge ? colors.error[500] : colors.neutral[400]}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomWidth: 0, opacity: settings.enabled ? 1 : 0.5 }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="eye-outline" size={24} color={colors.warning[500]} />
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, typography.bodyBold, { color: colors.text }]}>
                  Önizleme
                </Text>
                <Text style={[styles.settingDescription, typography.caption, { color: colors.textSecondary }]}>
                  Bildirimde içerik göster
                </Text>
              </View>
            </View>
            <Switch
              value={settings.preview}
              onValueChange={() => toggleSetting('preview')}
              disabled={!settings.enabled}
              trackColor={{ false: colors.neutral[300], true: colors.warning[300] }}
              thumbColor={settings.preview ? colors.warning[500] : colors.neutral[400]}
            />
          </View>
        </View>

        {/* Reminders */}
        <View style={[styles.remindersCard, { backgroundColor: 'white' }, shadows.small]}>
          <View style={styles.remindersHeader}>
            <Text style={[styles.sectionTitle, typography.h3, { color: colors.text }]}>
              Hatırlatıcılar
            </Text>
            <TouchableOpacity onPress={() => setShowAddModal(true)}>
              <LinearGradient colors={colors.gradients.primary} style={styles.addButton}>
                <Ionicons name="add" size={20} color="white" />
                <Text style={[styles.addButtonText, { color: 'white' }]}>Ekle</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {reminders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="alarm-outline" size={48} color={colors.neutral[300]} />
              <Text style={[styles.emptyText, typography.body, { color: colors.textSecondary }]}>
                Henüz hatırlatıcı yok
              </Text>
            </View>
          ) : (
            reminders.map((reminder) => {
              const typeInfo = getReminderTypeInfo(reminder.type);
              return (
                <View
                  key={reminder.id}
                  style={[
                    styles.reminderItem,
                    { borderLeftColor: typeInfo.color },
                    !reminder.enabled && styles.reminderDisabled,
                  ]}
                >
                  <View style={styles.reminderLeft}>
                    <View style={[styles.reminderIcon, { backgroundColor: typeInfo.color + '20' }]}>
                      <Ionicons name={typeInfo.icon as any} size={24} color={typeInfo.color} />
                    </View>
                    <View style={styles.reminderInfo}>
                      <Text style={[styles.reminderTitle, typography.bodyBold, { color: colors.text }]}>
                        {reminder.title}
                      </Text>
                      <View style={styles.reminderMetadata}>
                        <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                        <Text style={[styles.reminderTime, typography.caption, { color: colors.textSecondary }]}>
                          {reminder.time}
                        </Text>
                        <Text style={[styles.reminderType, typography.caption, { color: typeInfo.color }]}>
                          • {typeInfo.label}
                        </Text>
                      </View>
                      <View style={styles.reminderDays}>
                        {reminder.days.map((day) => (
                          <View key={day} style={[styles.dayChip, { backgroundColor: typeInfo.color + '20' }]}>
                            <Text style={[styles.dayChipText, { color: typeInfo.color }]}>
                              {dayNames[day]}
                            </Text>
                          </View>
                        ))}
                      </View>
                      <View style={styles.reminderOptions}>
                        {reminder.sound && (
                          <View style={styles.optionChip}>
                            <Ionicons name="volume-high" size={12} color={colors.textSecondary} />
                            <Text style={[styles.optionText, { color: colors.textSecondary }]}>Ses</Text>
                          </View>
                        )}
                        {reminder.vibrate && (
                          <View style={styles.optionChip}>
                            <Ionicons name="phone-portrait" size={12} color={colors.textSecondary} />
                            <Text style={[styles.optionText, { color: colors.textSecondary }]}>Titreşim</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  <View style={styles.reminderRight}>
                    <Switch
                      value={reminder.enabled}
                      onValueChange={() => toggleReminder(reminder.id)}
                      trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                      thumbColor={reminder.enabled ? colors.primary[500] : colors.neutral[400]}
                    />
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteReminder(reminder.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color={colors.error[500]} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: colors.primary[50] }]}>
          <Ionicons name="information-circle" size={24} color={colors.primary[600]} />
          <Text style={[styles.infoText, typography.caption, { color: colors.primary[700] }]}>
            Hatırlatıcılar ayarlanan saatte bildirim gönderir. Uygulama kapalı olsa bile bildirimler gelir.
          </Text>
        </View>
      </ScrollView>

      {/* Add Reminder Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: 'white' }, shadows.large]}>
            <Text style={[styles.modalTitle, typography.h2, { color: colors.text }]}>
              Yeni Hatırlatıcı
            </Text>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <TextInput
                style={[styles.input, { borderColor: colors.neutral[300], color: colors.text }]}
                placeholder="Hatırlatıcı Başlığı"
                placeholderTextColor={colors.textSecondary}
                value={newReminder.title}
                onChangeText={(text) => setNewReminder({ ...newReminder, title: text })}
              />

              <TextInput
                style={[styles.input, { borderColor: colors.neutral[300], color: colors.text }]}
                placeholder="Saat (HH:MM)"
                placeholderTextColor={colors.textSecondary}
                value={newReminder.time}
                onChangeText={(text) => setNewReminder({ ...newReminder, time: text })}
              />

              <Text style={[styles.inputLabel, typography.bodyBold, { color: colors.text }]}>
                Tip:
              </Text>
              <View style={styles.typeButtons}>
                {reminderTypes.map((type) => (
                  <TouchableOpacity
                    key={type.type}
                    style={[
                      styles.typeButton,
                      { borderColor: colors.neutral[300] },
                      newReminder.type === type.type && {
                        backgroundColor: type.color + '20',
                        borderColor: type.color,
                      },
                    ]}
                    onPress={() => setNewReminder({ ...newReminder, type: type.type })}
                  >
                    <Ionicons
                      name={type.icon as any}
                      size={20}
                      color={newReminder.type === type.type ? type.color : colors.neutral[500]}
                    />
                    <Text
                      style={[
                        styles.typeButtonLabel,
                        { color: newReminder.type === type.type ? type.color : colors.neutral[600] },
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.inputLabel, typography.bodyBold, { color: colors.text }]}>
                Günler:
              </Text>
              <View style={styles.dayButtons}>
                {dayNames.map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayButton,
                      { borderColor: colors.neutral[300] },
                      newReminder.days?.includes(index) && {
                        backgroundColor: colors.primary[500],
                        borderColor: colors.primary[500],
                      },
                    ]}
                    onPress={() => toggleReminderDay(index)}
                  >
                    <Text
                      style={[
                        styles.dayButtonText,
                        {
                          color: newReminder.days?.includes(index)
                            ? 'white'
                            : colors.neutral[600],
                        },
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.switchRow}>
                <Text style={[styles.switchLabel, typography.body, { color: colors.text }]}>Ses</Text>
                <Switch
                  value={newReminder.sound ?? true}
                  onValueChange={(value) => setNewReminder({ ...newReminder, sound: value })}
                  trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                  thumbColor={newReminder.sound ? colors.primary[500] : colors.neutral[400]}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={[styles.switchLabel, typography.body, { color: colors.text }]}>Titreşim</Text>
                <Switch
                  value={newReminder.vibrate ?? true}
                  onValueChange={(value) => setNewReminder({ ...newReminder, vibrate: value })}
                  trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                  thumbColor={newReminder.vibrate ? colors.primary[500] : colors.neutral[400]}
                />
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.neutral[200] }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleAddReminder}>
                <LinearGradient colors={colors.gradients.primary} style={styles.modalButton}>
                  <Text style={[styles.modalButtonText, { color: 'white' }]}>Kaydet</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  headerTitle: {
    marginTop: 12,
    textAlign: 'center',
  },
  headerSubtitle: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  settingsCard: {
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingInfo: {
    flex: 1,
    gap: 4,
  },
  settingLabel: {},
  settingDescription: {},
  remindersCard: {
    marginTop: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  remindersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    marginTop: 12,
    textAlign: 'center',
  },
  reminderItem: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    marginBottom: 12,
  },
  reminderDisabled: {
    opacity: 0.5,
  },
  reminderLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  reminderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderInfo: {
    flex: 1,
    gap: 6,
  },
  reminderTitle: {},
  reminderMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reminderTime: {},
  reminderType: {},
  reminderDays: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  dayChip: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  dayChipText: {
    fontSize: 10,
    fontWeight: '600',
  },
  reminderOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  optionText: {
    fontSize: 11,
  },
  reminderRight: {
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 8,
  },
  infoCard: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  infoText: {},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    padding: 24,
    borderRadius: 24,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  modalForm: {
    maxHeight: 500,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  typeButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  dayButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchLabel: {},
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
