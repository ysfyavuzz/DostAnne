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

interface RoutineItem {
  id: string;
  time: string;
  title: string;
  type: 'feeding' | 'sleep' | 'play' | 'bath' | 'medicine' | 'other';
  notes?: string;
  completed: boolean;
}

interface DailyPlan {
  date: string;
  routines: RoutineItem[];
}

const getRoutineTypeInfo = (type: RoutineItem['type']) => {
  switch (type) {
    case 'feeding':
      return { icon: 'restaurant' as const, color: '#FF6B9D', label: 'Beslenme' };
    case 'sleep':
      return { icon: 'moon' as const, color: '#8B5CF6', label: 'Uyku' };
    case 'play':
      return { icon: 'football' as const, color: '#10B981', label: 'Oyun' };
    case 'bath':
      return { icon: 'water' as const, color: '#3B82F6', label: 'Banyo' };
    case 'medicine':
      return { icon: 'medical' as const, color: '#EF4444', label: 'İlaç' };
    case 'other':
      return { icon: 'ellipsis-horizontal' as const, color: '#6B7280', label: 'Diğer' };
  }
};

// Sample routines
const sampleRoutines: RoutineItem[] = [
  { id: '1', time: '07:00', title: 'Sabah Emzirme', type: 'feeding', completed: false },
  { id: '2', time: '08:00', title: 'Sabah Uykusu', type: 'sleep', completed: false },
  { id: '3', time: '10:00', title: 'Oyun Zamanı', type: 'play', completed: false },
  { id: '4', time: '11:00', title: 'Öğle Emzirme', type: 'feeding', completed: false },
  { id: '5', time: '12:00', title: 'Öğle Uykusu', type: 'sleep', completed: false },
  { id: '6', time: '14:00', title: 'Oyun ve Aktivite', type: 'play', completed: false },
  { id: '7', time: '15:00', title: 'İkindi Emzirme', type: 'feeding', completed: false },
  { id: '8', time: '18:00', title: 'Banyo Zamanı', type: 'bath', completed: false },
  { id: '9', time: '19:00', title: 'Akşam Emzirme', type: 'feeding', completed: false },
  { id: '10', time: '20:00', title: 'Gece Uykusu', type: 'sleep', completed: false },
];

export default function PlannerScreenNew() {
  const { colors, spacing, borderRadius, typography, shadows } = useThemedStyles();
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [routines, setRoutines] = useState<RoutineItem[]>(sampleRoutines);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoutine, setNewRoutine] = useState<Partial<RoutineItem>>({
    time: '',
    title: '',
    type: 'other',
    notes: '',
  });

  // Calculate completion stats
  const stats = useMemo(() => {
    const completed = routines.filter(r => r.completed).length;
    const total = routines.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    return { completed, total, percentage };
  }, [routines]);

  // Group routines by time of day
  const groupedRoutines = useMemo(() => {
    const morning: RoutineItem[] = [];
    const afternoon: RoutineItem[] = [];
    const evening: RoutineItem[] = [];
    const night: RoutineItem[] = [];

    routines.forEach(routine => {
      const hour = parseInt(routine.time.split(':')[0]);
      if (hour >= 6 && hour < 12) {
        morning.push(routine);
      } else if (hour >= 12 && hour < 17) {
        afternoon.push(routine);
      } else if (hour >= 17 && hour < 21) {
        evening.push(routine);
      } else {
        night.push(routine);
      }
    });

    return {
      morning: morning.sort((a, b) => a.time.localeCompare(b.time)),
      afternoon: afternoon.sort((a, b) => a.time.localeCompare(b.time)),
      evening: evening.sort((a, b) => a.time.localeCompare(b.time)),
      night: night.sort((a, b) => a.time.localeCompare(b.time)),
    };
  }, [routines]);

  // Toggle routine completion
  const toggleRoutine = (id: string) => {
    setRoutines(routines.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  // Add new routine
  const handleAddRoutine = () => {
    if (!newRoutine.time || !newRoutine.title) {
      Alert.alert('Hata', 'Lütfen saat ve başlık alanlarını doldurun');
      return;
    }

    const routine: RoutineItem = {
      id: Date.now().toString(),
      time: newRoutine.time!,
      title: newRoutine.title!,
      type: newRoutine.type as RoutineItem['type'],
      notes: newRoutine.notes,
      completed: false,
    };

    setRoutines([...routines, routine].sort((a, b) => a.time.localeCompare(b.time)));
    setNewRoutine({ time: '', title: '', type: 'other', notes: '' });
    setShowAddModal(false);
    Alert.alert('Başarılı', 'Rutin eklendi');
  };

  // Delete routine
  const handleDeleteRoutine = (id: string) => {
    Alert.alert(
      'Rutin Sil',
      'Bu rutini silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => setRoutines(routines.filter(r => r.id !== id)),
        },
      ]
    );
  };

  // Render routine group
  const renderRoutineGroup = (title: string, icon: keyof typeof Ionicons.glyphMap, items: RoutineItem[], color: string) => {
    if (items.length === 0) return null;

    return (
      <View style={[styles.groupCard, { backgroundColor: 'white' }, shadows.small]}>
        <View style={styles.groupHeader}>
          <View style={[styles.groupIcon, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon} size={24} color={color} />
          </View>
          <Text style={[styles.groupTitle, typography.h4, { color: colors.text }]}>
            {title}
          </Text>
          <Text style={[styles.groupCount, typography.caption, { color: colors.textSecondary }]}>
            {items.filter(i => i.completed).length}/{items.length}
          </Text>
        </View>

        {items.map((routine) => {
          const typeInfo = getRoutineTypeInfo(routine.type);
          return (
            <TouchableOpacity
              key={routine.id}
              style={[
                styles.routineItem,
                { borderLeftColor: typeInfo.color },
                routine.completed && styles.routineCompleted,
              ]}
              onPress={() => toggleRoutine(routine.id)}
              onLongPress={() => handleDeleteRoutine(routine.id)}
            >
              <View style={styles.routineLeft}>
                <View style={[styles.routineTypeIcon, { backgroundColor: typeInfo.color + '20' }]}>
                  <Ionicons name={typeInfo.icon} size={20} color={typeInfo.color} />
                </View>
                <View style={styles.routineInfo}>
                  <Text
                    style={[
                      styles.routineTitle,
                      typography.bodyBold,
                      { color: colors.text },
                      routine.completed && styles.routineTitleCompleted,
                    ]}
                  >
                    {routine.title}
                  </Text>
                  <View style={styles.routineMetadata}>
                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.routineTime, typography.caption, { color: colors.textSecondary }]}>
                      {routine.time}
                    </Text>
                    <Text style={[styles.routineType, typography.caption, { color: typeInfo.color }]}>
                      • {typeInfo.label}
                    </Text>
                  </View>
                  {routine.notes && (
                    <Text style={[styles.routineNotes, typography.caption, { color: colors.textSecondary }]}>
                      {routine.notes}
                    </Text>
                  )}
                </View>
              </View>
              <Ionicons
                name={routine.completed ? 'checkmark-circle' : 'checkmark-circle-outline'}
                size={32}
                color={routine.completed ? colors.success[500] : colors.neutral[300]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Header */}
      <LinearGradient
        colors={colors.gradients.blue}
        style={[styles.header, shadows.medium]}
      >
        <Ionicons name="calendar" size={48} color="white" />
        <Text style={[styles.headerTitle, typography.h1, { color: 'white' }]}>
          Günlük Planlayıcı
        </Text>
        <Text style={[styles.headerSubtitle, typography.body, { color: 'white' }]}>
          Bebeğinizin günlük rutinini planlayın
        </Text>
      </LinearGradient>

      {/* Progress Card */}
      <View style={[styles.progressCard, { backgroundColor: 'white' }, shadows.medium]}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressTitle, typography.h3, { color: colors.text }]}>
            Bugünün İlerlemesi
          </Text>
          <TouchableOpacity onPress={() => setShowAddModal(true)}>
            <LinearGradient colors={colors.gradients.primary} style={styles.addButton}>
              <Ionicons name="add" size={20} color="white" />
              <Text style={[styles.addButtonText, { color: 'white' }]}>
                Ekle
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.progressStats}>
          <View style={styles.progressStatItem}>
            <Text style={[styles.progressStatValue, typography.h1, { color: colors.primary[500] }]}>
              {stats.completed}
            </Text>
            <Text style={[styles.progressStatLabel, typography.caption, { color: colors.textSecondary }]}>
              Tamamlandı
            </Text>
          </View>
          <View style={styles.progressStatDivider} />
          <View style={styles.progressStatItem}>
            <Text style={[styles.progressStatValue, typography.h1, { color: colors.neutral[500] }]}>
              {stats.total - stats.completed}
            </Text>
            <Text style={[styles.progressStatLabel, typography.caption, { color: colors.textSecondary }]}>
              Kalan
            </Text>
          </View>
          <View style={styles.progressStatDivider} />
          <View style={styles.progressStatItem}>
            <Text style={[styles.progressStatValue, typography.h1, { color: colors.success[500] }]}>
              {Math.round(stats.percentage)}%
            </Text>
            <Text style={[styles.progressStatLabel, typography.caption, { color: colors.textSecondary }]}>
              İlerleme
            </Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: colors.success[500], width: `${stats.percentage}%` },
            ]}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Morning */}
        {renderRoutineGroup('Sabah', 'sunny', groupedRoutines.morning, '#F59E0B')}

        {/* Afternoon */}
        {renderRoutineGroup('Öğleden Sonra', 'partly-sunny', groupedRoutines.afternoon, '#10B981')}

        {/* Evening */}
        {renderRoutineGroup('Akşam', 'cloudy', groupedRoutines.evening, '#8B5CF6')}

        {/* Night */}
        {renderRoutineGroup('Gece', 'moon', groupedRoutines.night, '#3B82F6')}

        {/* Tips Card */}
        <View style={[styles.tipsCard, { backgroundColor: colors.primary[50] }]}>
          <Ionicons name="bulb" size={32} color={colors.primary[600]} />
          <View style={styles.tipsContent}>
            <Text style={[styles.tipsTitle, typography.h4, { color: colors.primary[700] }]}>
              İpucu
            </Text>
            <Text style={[styles.tipsText, typography.body, { color: colors.primary[600] }]}>
              Düzenli bir rutin oluşturmak bebeğinizin uyku ve beslenme düzenini iyileştirir. Uzun süreli basarak rutini silebilirsiniz.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Add Routine Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: 'white' }, shadows.large]}>
            <Text style={[styles.modalTitle, typography.h2, { color: colors.text }]}>
              Yeni Rutin Ekle
            </Text>

            <View style={styles.form}>
              <TextInput
                style={[styles.input, { borderColor: colors.neutral[300], color: colors.text }]}
                placeholder="Başlık"
                placeholderTextColor={colors.textSecondary}
                value={newRoutine.title}
                onChangeText={(text) => setNewRoutine({ ...newRoutine, title: text })}
              />

              <TextInput
                style={[styles.input, { borderColor: colors.neutral[300], color: colors.text }]}
                placeholder="Saat (HH:MM)"
                placeholderTextColor={colors.textSecondary}
                value={newRoutine.time}
                onChangeText={(text) => setNewRoutine({ ...newRoutine, time: text })}
              />

              <View style={styles.typeButtons}>
                {[
                  { type: 'feeding', icon: 'restaurant', label: 'Beslenme' },
                  { type: 'sleep', icon: 'moon', label: 'Uyku' },
                  { type: 'play', icon: 'football', label: 'Oyun' },
                  { type: 'bath', icon: 'water', label: 'Banyo' },
                  { type: 'medicine', icon: 'medical', label: 'İlaç' },
                  { type: 'other', icon: 'ellipsis-horizontal', label: 'Diğer' },
                ].map((item) => {
                  const typeInfo = getRoutineTypeInfo(item.type as RoutineItem['type']);
                  return (
                    <TouchableOpacity
                      key={item.type}
                      style={[
                        styles.typeButton,
                        { borderColor: colors.neutral[300] },
                        newRoutine.type === item.type && { 
                          backgroundColor: typeInfo.color + '20', 
                          borderColor: typeInfo.color 
                        },
                      ]}
                      onPress={() => setNewRoutine({ ...newRoutine, type: item.type as RoutineItem['type'] })}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={newRoutine.type === item.type ? typeInfo.color : colors.neutral[500]}
                      />
                      <Text
                        style={[
                          styles.typeButtonLabel,
                          { color: newRoutine.type === item.type ? typeInfo.color : colors.neutral[600] },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TextInput
                style={[styles.input, styles.textArea, { borderColor: colors.neutral[300], color: colors.text }]}
                placeholder="Notlar (opsiyonel)"
                placeholderTextColor={colors.textSecondary}
                value={newRoutine.notes}
                onChangeText={(text) => setNewRoutine({ ...newRoutine, notes: text })}
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.neutral[200] }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleAddRoutine}>
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
  progressCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {},
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
  progressStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressStatItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  progressStatValue: {},
  progressStatLabel: {},
  progressStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  groupCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  groupIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupTitle: {
    flex: 1,
  },
  groupCount: {},
  routineItem: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    marginBottom: 12,
  },
  routineCompleted: {
    opacity: 0.6,
  },
  routineLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  routineTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routineInfo: {
    flex: 1,
    gap: 4,
  },
  routineTitle: {},
  routineTitleCompleted: {
    textDecorationLine: 'line-through',
  },
  routineMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routineTime: {},
  routineType: {},
  routineNotes: {
    fontStyle: 'italic',
  },
  tipsCard: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  tipsContent: {
    flex: 1,
    gap: 8,
  },
  tipsTitle: {},
  tipsText: {},
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
    minHeight: 60,
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
