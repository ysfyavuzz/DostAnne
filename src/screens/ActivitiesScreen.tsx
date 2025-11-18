import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, addActivity } from '../store/store';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { AppHeader } from '../components/ui/AppHeader';

type ActivityType = 'feeding' | 'sleep' | 'diaper' | 'health' | 'play' | 'milestone';

interface ActivityTypeConfig {
  type: ActivityType;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  gradient: string[];
}

const ActivitiesScreenNew = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { colors, typography, spacing, borderRadius, shadows, isDark } = useThemedStyles();
  
  const activities = useSelector((state: RootState) => state.activities.activities);
  const currentBaby = useSelector((state: RootState) => state.database.currentBaby);
  
  const [selectedFilter, setSelectedFilter] = useState<ActivityType | 'all'>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedActivityType, setSelectedActivityType] = useState<ActivityType>('feeding');
  const [activityNotes, setActivityNotes] = useState('');

  const activityTypes: ActivityTypeConfig[] = useMemo(() => [
    { 
      type: 'feeding', 
      icon: 'restaurant', 
      label: 'Emzirme', 
      color: colors.activity.feeding,
      gradient: colors.gradients.primary,
    },
    { 
      type: 'sleep', 
      icon: 'moon', 
      label: 'Uyku', 
      color: colors.activity.sleep,
      gradient: colors.gradients.purple,
    },
    { 
      type: 'diaper', 
      icon: 'water', 
      label: 'Bez', 
      color: colors.activity.diaper,
      gradient: colors.gradients.success,
    },
    { 
      type: 'health', 
      icon: 'medical', 
      label: 'Sağlık', 
      color: colors.activity.health,
      gradient: colors.gradients.sunset,
    },
    { 
      type: 'play', 
      icon: 'game-controller', 
      label: 'Oyun', 
      color: colors.activity.play,
      gradient: colors.gradients.ocean,
    },
    { 
      type: 'milestone', 
      icon: 'star', 
      label: 'Milestone', 
      color: colors.activity.milestone,
      gradient: colors.gradients.secondary,
    },
  ], [colors]);

  const filteredActivities = useMemo(() => {
    if (selectedFilter === 'all') return activities;
    return activities.filter(a => a.type === selectedFilter);
  }, [activities, selectedFilter]);

  const groupedActivities = useMemo(() => {
    const groups: { [key: string]: typeof activities } = {};
    
    filteredActivities.forEach(activity => {
      const date = new Date(activity.startTime).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
    });

    return Object.entries(groups).sort((a, b) => {
      return new Date(b[1][0].startTime).getTime() - new Date(a[1][0].startTime).getTime();
    });
  }, [filteredActivities]);

  const getActivityConfig = useCallback((type: ActivityType) => {
    return activityTypes.find(at => at.type === type);
  }, [activityTypes]);

  const handleAddActivity = useCallback(() => {
    if (!currentBaby) {
      Alert.alert('Uyarı', 'Lütfen önce bebek profilini oluşturun.');
      return;
    }

    const newActivity = {
      id: Date.now().toString(),
      babyId: currentBaby.id?.toString() || '1',
      type: selectedActivityType,
      actor: 'baby' as const,
      startTime: new Date().toISOString(),
      notes: activityNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    dispatch(addActivity(newActivity));
    setModalVisible(false);
    setActivityNotes('');
    Alert.alert('Başarılı', 'Aktivite eklendi!');
  }, [currentBaby, selectedActivityType, activityNotes, dispatch]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return 'Devam ediyor';
    
    const diff = new Date(endTime).getTime() - new Date(startTime).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}s ${minutes}d`;
    return `${minutes}d`;
  };

  const renderActivityItem = ({ item }: { item: typeof activities[0] }) => {
    const config = getActivityConfig(item.type);
    if (!config) return null;

    return (
      <View style={styles(colors, typography, spacing, borderRadius, shadows, isDark).activityItem}>
        <View style={[
          styles(colors, typography, spacing, borderRadius, shadows, isDark).activityIcon,
          { backgroundColor: config.color + '20' }
        ]}>
          <Ionicons name={config.icon} size={24} color={config.color} />
        </View>
        
        <View style={styles(colors, typography, spacing, borderRadius, shadows, isDark).activityContent}>
          <Text style={styles(colors, typography, spacing, borderRadius, shadows, isDark).activityTitle}>
            {config.label}
          </Text>
          <Text style={styles(colors, typography, spacing, borderRadius, shadows, isDark).activityTime}>
            {formatTime(item.startTime)}
            {item.endTime && ` • ${formatDuration(item.startTime, item.endTime)}`}
          </Text>
          {item.notes && (
            <Text style={styles(colors, typography, spacing, borderRadius, shadows, isDark).activityNotes}>
              {item.notes}
            </Text>
          )}
        </View>

        {item.endTime && (
          <View style={styles(colors, typography, spacing, borderRadius, shadows, isDark).activityStatus}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success[500]} />
          </View>
        )}
      </View>
    );
  };

  const stylesObj = styles(colors, typography, spacing, borderRadius, shadows, isDark);

  return (
    <SafeAreaView style={stylesObj.safeArea} edges={['bottom']}>
      <AppHeader title="Takip" />
      <View style={stylesObj.container}>
      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={stylesObj.filterContainer}
        contentContainerStyle={stylesObj.filterContent}
      >
        <TouchableOpacity
          style={[stylesObj.filterChip, selectedFilter === 'all' && stylesObj.filterChipActive]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[
            stylesObj.filterChipText,
            selectedFilter === 'all' && stylesObj.filterChipTextActive
          ]}>
            Tümü ({activities.length})
          </Text>
        </TouchableOpacity>

        {activityTypes.map((type) => (
          <TouchableOpacity
            key={type.type}
            style={[
              stylesObj.filterChip,
              selectedFilter === type.type && stylesObj.filterChipActive,
              { borderColor: type.color }
            ]}
            onPress={() => setSelectedFilter(type.type)}
          >
            <Ionicons 
              name={type.icon} 
              size={16} 
              color={selectedFilter === type.type ? 'white' : type.color}
              style={{ marginRight: spacing.xs }}
            />
            <Text style={[
              stylesObj.filterChipText,
              selectedFilter === type.type && stylesObj.filterChipTextActive
            ]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Activities List */}
      {groupedActivities.length > 0 ? (
        <FlatList
          data={groupedActivities}
          keyExtractor={(item) => item[0]}
          renderItem={({ item: [date, dateActivities] }) => (
            <View style={stylesObj.dateGroup}>
              <Text style={stylesObj.dateHeader}>{date}</Text>
              {dateActivities.map((activity) => (
                <View key={activity.id}>
                  {renderActivityItem({ item: activity })}
                </View>
              ))}
            </View>
          )}
          contentContainerStyle={stylesObj.listContent}
        />
      ) : (
        <View style={stylesObj.emptyState}>
          <Ionicons name="list-outline" size={64} color={colors.neutral[300]} />
          <Text style={stylesObj.emptyStateTitle}>Henüz aktivite yok</Text>
          <Text style={stylesObj.emptyStateDescription}>
            {selectedFilter === 'all' 
              ? 'Aktivite eklemek için + butonuna dokunun'
              : 'Bu kategoride aktivite bulunmuyor'}
          </Text>
        </View>
      )}

      {/* Add Button */}
      <TouchableOpacity
        style={stylesObj.addButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={stylesObj.addButtonGradient}
        >
          <Ionicons name="add" size={28} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Add Activity Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={stylesObj.modalOverlay}>
          <View style={stylesObj.modalContent}>
            <View style={stylesObj.modalHeader}>
              <Text style={stylesObj.modalTitle}>Aktivite Ekle</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.neutral[600]} />
              </TouchableOpacity>
            </View>

            <Text style={stylesObj.modalLabel}>Aktivite Türü</Text>
            <View style={stylesObj.activityTypeGrid}>
              {activityTypes.map((type) => (
                <TouchableOpacity
                  key={type.type}
                  style={[
                    stylesObj.activityTypeCard,
                    selectedActivityType === type.type && stylesObj.activityTypeCardActive
                  ]}
                  onPress={() => setSelectedActivityType(type.type)}
                >
                  <Ionicons 
                    name={type.icon} 
                    size={24} 
                    color={selectedActivityType === type.type ? 'white' : type.color} 
                  />
                  <Text style={[
                    stylesObj.activityTypeLabel,
                    selectedActivityType === type.type && stylesObj.activityTypeLabelActive
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={stylesObj.modalLabel}>Notlar (Opsiyonel)</Text>
            <TextInput
              style={stylesObj.textInput}
              value={activityNotes}
              onChangeText={setActivityNotes}
              placeholder="Aktivite hakkında notlarınız..."
              placeholderTextColor={colors.neutral[400]}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={stylesObj.saveButton}
              onPress={handleAddActivity}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={colors.gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={stylesObj.saveButtonGradient}
              >
                <Ionicons name="checkmark" size={20} color="white" />
                <Text style={stylesObj.saveButtonText}>Kaydet</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </SafeAreaView>
  );
};

const styles = (colors: any, typography: any, spacing: any, borderRadius: any, shadows: any, isDark: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: isDark ? colors.background.dark : colors.background.light,
  },
  container: {
    flex: 1,
  },
  filterContainer: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  filterContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.neutral[300],
    backgroundColor: isDark ? colors.background.cardDark : 'white',
  },
  filterChipActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  filterChipText: {
    ...typography.labelLarge,
    color: colors.text.secondary,
  },
  filterChipTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.lg,
  },
  dateGroup: {
    marginBottom: spacing['2xl'],
  },
  dateHeader: {
    ...typography.h5,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? colors.background.cardDark : 'white',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    ...typography.labelLarge,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  activityTime: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  activityNotes: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  activityStatus: {
    marginLeft: spacing.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['4xl'],
  },
  emptyStateTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateDescription: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing['2xl'],
    borderRadius: borderRadius.full,
    ...shadows.xl,
  },
  addButtonGradient: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: isDark ? colors.background.cardDark : 'white',
    borderTopLeftRadius: borderRadius['3xl'],
    borderTopRightRadius: borderRadius['3xl'],
    padding: spacing['2xl'],
    paddingBottom: spacing['4xl'],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  modalLabel: {
    ...typography.labelLarge,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  activityTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  activityTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: colors.neutral[200],
    backgroundColor: isDark ? colors.background.dark : colors.neutral[50],
    gap: spacing.sm,
  },
  activityTypeCardActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  activityTypeLabel: {
    ...typography.label,
    color: colors.text.primary,
  },
  activityTypeLabelActive: {
    color: 'white',
    fontWeight: '600',
  },
  textInput: {
    ...typography.body,
    backgroundColor: isDark ? colors.background.dark : colors.neutral[50],
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    minHeight: 100,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  saveButton: {
    marginTop: spacing['2xl'],
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  saveButtonText: {
    ...typography.button,
    color: 'white',
  },
});

export default React.memo(ActivitiesScreenNew);
