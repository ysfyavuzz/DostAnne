import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'doctor' | 'vaccine' | 'checkup' | 'other';
  notes?: string;
  completed: boolean;
}

// Mock appointments - in real app, this would come from database
const mockAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Doktor Kontrolü',
    date: '2024-11-20',
    time: '14:00',
    type: 'doctor',
    notes: 'Genel sağlık kontrolü',
    completed: false,
  },
  {
    id: '2',
    title: 'Aşı Randevusu - KPA',
    date: '2024-11-25',
    time: '10:30',
    type: 'vaccine',
    notes: '2. doz KPA aşısı',
    completed: false,
  },
  {
    id: '3',
    title: 'Boy-Kilo Ölçümü',
    date: '2024-12-01',
    time: '11:00',
    type: 'checkup',
    completed: false,
  },
];

export default function CalendarScreenNew() {
  const { colors, spacing, borderRadius, typography, shadows } = useThemedStyles();
  const currentBaby = useSelector((state: RootState) => state.database.currentBaby);
  const activities = useSelector((state: RootState) => state.database.activities);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);

  // New appointment form state
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    title: '',
    date: '',
    time: '',
    type: 'doctor',
    notes: '',
  });

  // Get current month calendar data
  const calendarData = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return { year, month, days, monthName: firstDay.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }) };
  }, [selectedDate]);

  // Get appointments for selected date
  const selectedDateAppointments = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return appointments.filter((apt) => apt.date === dateStr);
  }, [selectedDate, appointments]);

  // Get activities for selected date
  const selectedDateActivities = useMemo(() => {
    const dateStr = selectedDate.toDateString();
    return activities.filter((a) => new Date(a.startTime).toDateString() === dateStr);
  }, [selectedDate, activities]);

  // Check if a date has appointments
  const hasAppointments = (day: number) => {
    const dateStr = new Date(calendarData.year, calendarData.month, day).toISOString().split('T')[0];
    return appointments.some((apt) => apt.date === dateStr);
  };

  // Check if a date has activities
  const hasActivities = (day: number) => {
    const dateStr = new Date(calendarData.year, calendarData.month, day).toDateString();
    return activities.some((a) => new Date(a.startTime).toDateString() === dateStr);
  };

  // Navigate month
  const goToPreviousMonth = () => {
    setSelectedDate(new Date(calendarData.year, calendarData.month - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(new Date(calendarData.year, calendarData.month + 1, 1));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Handle day selection
  const handleDayPress = (day: number) => {
    setSelectedDate(new Date(calendarData.year, calendarData.month, day));
  };

  // Add appointment
  const handleAddAppointment = () => {
    if (!newAppointment.title || !newAppointment.date || !newAppointment.time) {
      Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    const appointment: Appointment = {
      id: Date.now().toString(),
      title: newAppointment.title!,
      date: newAppointment.date!,
      time: newAppointment.time!,
      type: newAppointment.type as Appointment['type'],
      notes: newAppointment.notes,
      completed: false,
    };

    setAppointments([...appointments, appointment]);
    setNewAppointment({ title: '', date: '', time: '', type: 'doctor', notes: '' });
    setShowAddModal(false);
    Alert.alert('Başarılı', 'Randevu eklendi');
  };

  // Toggle appointment completion
  const toggleAppointmentComplete = (id: string) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === id ? { ...apt, completed: !apt.completed } : apt
      )
    );
  };

  // Get appointment icon and color
  const getAppointmentStyle = (type: Appointment['type']) => {
    switch (type) {
      case 'doctor':
        return { icon: 'medical' as const, color: colors.activity.health };
      case 'vaccine':
        return { icon: 'fitness' as const, color: colors.primary[500] };
      case 'checkup':
        return { icon: 'analytics' as const, color: colors.secondary[500] };
      default:
        return { icon: 'calendar' as const, color: colors.neutral[500] };
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Calendar Header */}
        <LinearGradient
          colors={colors.gradients.blue}
          style={[styles.headerCard, { borderRadius: borderRadius.xl }, shadows.medium]}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={goToPreviousMonth} style={styles.headerButton}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>

            <Text style={[styles.headerTitle, typography.h2, { color: 'white' }]}>
              {calendarData.monthName}
            </Text>

            <TouchableOpacity onPress={goToNextMonth} style={styles.headerButton}>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.todayButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            onPress={goToToday}
          >
            <Text style={[styles.todayButtonText, { color: 'white' }]}>Bugüne Dön</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Calendar Grid */}
        <View style={[styles.calendarCard, { backgroundColor: 'white' }, shadows.small]}>
          {/* Weekday Headers */}
          <View style={styles.weekdayRow}>
            {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map((day) => (
              <Text
                key={day}
                style={[styles.weekdayText, typography.caption, { color: colors.textSecondary }]}
              >
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Days */}
          <View style={styles.daysGrid}>
            {calendarData.days.map((day, index) => {
              if (day === null) {
                return <View key={`empty-${index}`} style={styles.dayCell} />;
              }

              const date = new Date(calendarData.year, calendarData.month, day);
              const isToday = date.toDateString() === new Date().toDateString();
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const hasApt = hasAppointments(day);
              const hasAct = hasActivities(day);

              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                    isToday && !isSelected && styles.dayCellToday,
                  ]}
                  onPress={() => handleDayPress(day)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      typography.body,
                      { color: isSelected ? 'white' : colors.text },
                      isToday && !isSelected && { color: colors.primary[500], fontWeight: '700' },
                    ]}
                  >
                    {day}
                  </Text>
                  <View style={styles.dayDots}>
                    {hasApt && (
                      <View style={[styles.dot, { backgroundColor: isSelected ? 'white' : colors.error[500] }]} />
                    )}
                    {hasAct && (
                      <View style={[styles.dot, { backgroundColor: isSelected ? 'white' : colors.primary[500] }]} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Date Info */}
        <View style={[styles.selectedDateCard, { backgroundColor: colors.primary[50] }]}>
          <Text style={[styles.selectedDateText, typography.h3, { color: colors.primary[700] }]}>
            {selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
          <View style={styles.selectedDateStats}>
            <View style={styles.selectedDateStat}>
              <Ionicons name="calendar" size={20} color={colors.primary[500]} />
              <Text style={[styles.selectedDateStatText, { color: colors.primary[600] }]}>
                {selectedDateAppointments.length} Randevu
              </Text>
            </View>
            <View style={styles.selectedDateStat}>
              <Ionicons name="list" size={20} color={colors.primary[500]} />
              <Text style={[styles.selectedDateStatText, { color: colors.primary[600] }]}>
                {selectedDateActivities.length} Aktivite
              </Text>
            </View>
          </View>
        </View>

        {/* Appointments List */}
        <View style={[styles.appointmentsCard, { backgroundColor: 'white' }, shadows.small]}>
          <View style={styles.appointmentsHeader}>
            <Text style={[styles.appointmentsTitle, typography.h3, { color: colors.text }]}>
              Randevular
            </Text>
            <TouchableOpacity onPress={() => setShowAddModal(true)}>
              <LinearGradient colors={colors.gradients.primary} style={styles.addButton}>
                <Ionicons name="add" size={20} color="white" />
                <Text style={[styles.addButtonText, { color: 'white' }]}>Ekle</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {selectedDateAppointments.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={colors.neutral[300]} />
              <Text style={[styles.emptyText, typography.body, { color: colors.textSecondary }]}>
                Bu tarih için randevu yok
              </Text>
            </View>
          ) : (
            selectedDateAppointments.map((apt) => {
              const style = getAppointmentStyle(apt.type);
              return (
                <TouchableOpacity
                  key={apt.id}
                  style={[
                    styles.appointmentItem,
                    { borderLeftColor: style.color },
                    apt.completed && styles.appointmentCompleted,
                  ]}
                  onPress={() => toggleAppointmentComplete(apt.id)}
                >
                  <View style={[styles.appointmentIcon, { backgroundColor: style.color + '20' }]}>
                    <Ionicons name={style.icon} size={24} color={style.color} />
                  </View>
                  <View style={styles.appointmentInfo}>
                    <Text
                      style={[
                        styles.appointmentTitle,
                        typography.bodyBold,
                        { color: colors.text },
                        apt.completed && styles.appointmentTitleCompleted,
                      ]}
                    >
                      {apt.title}
                    </Text>
                    <Text style={[styles.appointmentTime, typography.caption, { color: colors.textSecondary }]}>
                      {apt.time}
                    </Text>
                    {apt.notes && (
                      <Text style={[styles.appointmentNotes, typography.caption, { color: colors.textSecondary }]}>
                        {apt.notes}
                      </Text>
                    )}
                  </View>
                  <Ionicons
                    name={apt.completed ? 'checkmark-circle' : 'checkmark-circle-outline'}
                    size={28}
                    color={apt.completed ? colors.success[500] : colors.neutral[300]}
                  />
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Activities for Selected Date */}
        {selectedDateActivities.length > 0 && (
          <View style={[styles.activitiesCard, { backgroundColor: 'white' }, shadows.small]}>
            <Text style={[styles.activitiesTitle, typography.h3, { color: colors.text }]}>
              Bu Günün Aktiviteleri
            </Text>
            {selectedDateActivities.slice(0, 5).map((activity) => (
              <View
                key={activity.id}
                style={[styles.activityItem, { borderBottomColor: colors.neutral[200] }]}
              >
                <Ionicons
                  name={
                    activity.type === 'feeding'
                      ? 'restaurant'
                      : activity.type === 'sleep'
                      ? 'moon'
                      : activity.type === 'diaper'
                      ? 'water'
                      : 'heart'
                  }
                  size={24}
                  color={
                    activity.type === 'feeding'
                      ? colors.activity.feeding
                      : activity.type === 'sleep'
                      ? colors.activity.sleep
                      : activity.type === 'diaper'
                      ? colors.activity.diaper
                      : colors.activity.health
                  }
                />
                <Text style={[styles.activityText, typography.body, { color: colors.text }]}>
                  {activity.type === 'feeding'
                    ? 'Emzirme'
                    : activity.type === 'sleep'
                    ? 'Uyku'
                    : activity.type === 'diaper'
                    ? 'Bez Değişimi'
                    : 'Sağlık'}
                </Text>
                <Text style={[styles.activityTime, typography.caption, { color: colors.textSecondary }]}>
                  {new Date(activity.startTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Appointment Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: 'white' }, shadows.large]}>
            <Text style={[styles.modalTitle, typography.h2, { color: colors.text }]}>
              Yeni Randevu Ekle
            </Text>

            <View style={styles.form}>
              <TextInput
                style={[styles.input, { borderColor: colors.neutral[300], color: colors.text }]}
                placeholder="Randevu Başlığı"
                placeholderTextColor={colors.textSecondary}
                value={newAppointment.title}
                onChangeText={(text) => setNewAppointment({ ...newAppointment, title: text })}
              />

              <View style={styles.typeButtons}>
                {[
                  { type: 'doctor', icon: 'medical', label: 'Doktor' },
                  { type: 'vaccine', icon: 'fitness', label: 'Aşı' },
                  { type: 'checkup', icon: 'analytics', label: 'Kontrol' },
                  { type: 'other', icon: 'calendar', label: 'Diğer' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.type}
                    style={[
                      styles.typeButton,
                      { borderColor: colors.neutral[300] },
                      newAppointment.type === item.type && { backgroundColor: colors.primary[100], borderColor: colors.primary[500] },
                    ]}
                    onPress={() => setNewAppointment({ ...newAppointment, type: item.type as Appointment['type'] })}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={newAppointment.type === item.type ? colors.primary[500] : colors.neutral[500]}
                    />
                    <Text
                      style={[
                        styles.typeButtonLabel,
                        { color: newAppointment.type === item.type ? colors.primary[700] : colors.neutral[600] },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={[styles.input, { borderColor: colors.neutral[300], color: colors.text }]}
                placeholder="Tarih (YYYY-MM-DD)"
                placeholderTextColor={colors.textSecondary}
                value={newAppointment.date}
                onChangeText={(text) => setNewAppointment({ ...newAppointment, date: text })}
              />

              <TextInput
                style={[styles.input, { borderColor: colors.neutral[300], color: colors.text }]}
                placeholder="Saat (HH:MM)"
                placeholderTextColor={colors.textSecondary}
                value={newAppointment.time}
                onChangeText={(text) => setNewAppointment({ ...newAppointment, time: text })}
              />

              <TextInput
                style={[styles.input, styles.textArea, { borderColor: colors.neutral[300], color: colors.text }]}
                placeholder="Notlar (opsiyonel)"
                placeholderTextColor={colors.textSecondary}
                value={newAppointment.notes}
                onChangeText={(text) => setNewAppointment({ ...newAppointment, notes: text })}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.neutral[200] }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleAddAppointment}>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerCard: {
    marginTop: 16,
    padding: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    textAlign: 'center',
  },
  todayButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'center',
  },
  todayButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  calendarCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  dayCellSelected: {
    backgroundColor: '#FF6B9D',
    borderRadius: 12,
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: '#FF6B9D',
    borderRadius: 12,
  },
  dayText: {
    textAlign: 'center',
  },
  dayDots: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  selectedDateCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  selectedDateText: {
    textAlign: 'center',
    marginBottom: 12,
  },
  selectedDateStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  selectedDateStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectedDateStatText: {
    fontSize: 14,
    fontWeight: '600',
  },
  appointmentsCard: {
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
  },
  appointmentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  appointmentsTitle: {},
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
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    marginBottom: 12,
  },
  appointmentCompleted: {
    opacity: 0.6,
  },
  appointmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appointmentInfo: {
    flex: 1,
    gap: 4,
  },
  appointmentTitle: {},
  appointmentTitleCompleted: {
    textDecorationLine: 'line-through',
  },
  appointmentTime: {},
  appointmentNotes: {
    fontStyle: 'italic',
  },
  activitiesCard: {
    marginTop: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  activitiesTitle: {
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  activityText: {
    flex: 1,
  },
  activityTime: {},
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
    padding: 24,
    borderRadius: 24,
    maxHeight: '90%',
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
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
