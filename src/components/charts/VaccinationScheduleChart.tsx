import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Animated,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '@/src/hooks/useTheme';
import { createText } from '@/src/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const ThemedText = createText();
const { width: screenWidth } = Dimensions.get('window');

interface VaccinationScheduleItem {
  id: string;
  name: string;
  vaccineType: string;
  recommendedAge: string;
  dueDate: string;
  administeredDate?: string;
  status: 'pending' | 'completed' | 'overdue' | 'upcoming';
  importance: 'critical' | 'important' | 'routine';
  description: string;
  sideEffects: string[];
}

interface VaccinationScheduleChartProps {
  vaccinations: VaccinationScheduleItem[];
  onVaccinationUpdate: (id: string, administeredDate: string) => void;
  onScheduleReminder: (id: string, date: string) => void;
}

export default function VaccinationScheduleChart({
  vaccinations,
  onVaccinationUpdate,
  onScheduleReminder,
}: VaccinationScheduleChartProps) {
  const { colors } = useTheme();
  const [selectedVaccine, setSelectedVaccine] = useState<VaccinationScheduleItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [animatedValue] = useState(new Animated.Value(0));
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const filteredVaccinations = useMemo(() => {
    if (filterStatus === 'all') return vaccinations;
    return vaccinations.filter(v => v.status === filterStatus);
  }, [vaccinations, filterStatus]);

  const vaccinationTimelineData = useMemo(() => {
    const sortedVaccines = [...vaccinations].sort((a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

    const monthlyData = new Map<string, { completed: number; pending: number; overdue: number }>();
    
    sortedVaccines.forEach(vaccine => {
      const date = new Date(vaccine.dueDate);
      const monthKey = date.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' });
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { completed: 0, pending: 0, overdue: 0 });
      }
      
      const data = monthlyData.get(monthKey)!;
      if (vaccine.status === 'completed') data.completed++;
      else if (vaccine.status === 'pending') data.pending++;
      else if (vaccine.status === 'overdue') data.overdue++;
    });

    return {
      labels: Array.from(monthlyData.keys()).slice(-6),
      datasets: [
        {
          data: Array.from(monthlyData.values()).slice(-6).map(d => d.completed),
          color: () => '#95E77E',
          label: 'Tamamlandı',
        },
        {
          data: Array.from(monthlyData.values()).slice(-6).map(d => d.pending),
          color: () => '#FFA500',
          label: 'Bekliyor',
        },
        {
          data: Array.from(monthlyData.values()).slice(-6).map(d => d.overdue),
          color: () => '#FF6B6B',
          label: 'Gecikmiş',
        },
      ],
      legend: ['Tamamlandı', 'Bekliyor', 'Gecikmiş'],
    };
  }, [vaccinations]);

  const vaccinationStats = useMemo(() => {
    const completed = vaccinations.filter(v => v.status === 'completed').length;
    const pending = vaccinations.filter(v => v.status === 'pending').length;
    const overdue = vaccinations.filter(v => v.status === 'overdue').length;
    const upcoming = vaccinations.filter(v => v.status === 'upcoming').length;
    const total = vaccinations.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, pending, overdue, upcoming, total, completionRate };
  }, [vaccinations]);

  const upcomingVaccines = useMemo(() => {
    return vaccinations
      .filter(v => v.status === 'pending' || v.status === 'upcoming')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 3);
  }, [vaccinations]);

  const overdueVaccines = useMemo(() => {
    return vaccinations
      .filter(v => v.status === 'overdue')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [vaccinations]);

  const handleVaccinationComplete = () => {
    if (selectedVaccine) {
      Alert.alert(
        'Aşı Onayı',
        `"${selectedVaccine.name}" aşısını yapıldı olarak onaylıyor musunuz?`,
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Onayla',
            onPress: () => {
              onVaccinationUpdate(
                selectedVaccine.id,
                selectedDate.toISOString()
              );
              setShowDetailModal(false);
              setShowDatePicker(false);
              setSelectedVaccine(null);
            },
          },
        ]
      );
    }
  };

  const handleScheduleReminder = () => {
    if (selectedVaccine) {
      onScheduleReminder(selectedVaccine.id, selectedVaccine.dueDate);
      Alert.alert('Başarılı', 'Hatırlatıcı planlandı');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#95E77E';
      case 'pending': return '#FFA500';
      case 'overdue': return '#FF6B6B';
      case 'upcoming': return '#4A90E2';
      default: return '#ccc';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'pending': return 'time';
      case 'overdue': return 'warning';
      case 'upcoming': return 'calendar';
      default: return 'help-circle';
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'critical': return { text: 'Kritik', color: '#FF6B6B' };
      case 'important': return { text: 'Önemli', color: '#FFA500' };
      case 'routine': return { text: 'Rutin', color: '#4ECDC4' };
      default: return { text: 'Standart', color: '#ccc' };
    }
  };

  // Already memoized above, use them directly as stats, upcomingVaccines, overdueVaccines
  const stats = vaccinationStats;
  const timelineData = vaccinationTimelineData;

  const chartConfig = {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#e0e0e0',
    },
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* İstatistik Özeti */}
      <Animated.View style={[styles.statsContainer, { opacity: animatedValue }]}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Ionicons name="checkmark-circle" size={20} color="#95E77E" />
          <ThemedText style={styles.statValue}>{stats.completed}</ThemedText>
          <ThemedText style={styles.statLabel}>Tamamlandı</ThemedText>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Ionicons name="time" size={20} color="#FFA500" />
          <ThemedText style={styles.statValue}>{stats.pending}</ThemedText>
          <ThemedText style={styles.statLabel}>Bekliyor</ThemedText>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Ionicons name="warning" size={20} color="#FF6B6B" />
          <ThemedText style={styles.statValue}>{stats.overdue}</ThemedText>
          <ThemedText style={styles.statLabel}>Gecikmiş</ThemedText>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Ionicons name="analytics" size={20} color="#4A90E2" />
          <ThemedText style={styles.statValue}>{stats.completionRate}%</ThemedText>
          <ThemedText style={styles.statLabel}>Tamamlanma</ThemedText>
        </View>
      </Animated.View>

      {/* Filtreler */}
      <View style={[styles.filterContainer, { backgroundColor: colors.card }]}>
        <ThemedText style={styles.filterTitle}>Filtrele</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterButtons}>
            {[
              { key: 'all', label: 'Tümü', count: stats.total },
              { key: 'completed', label: 'Tamamlandı', count: stats.completed },
              { key: 'pending', label: 'Bekliyor', count: stats.pending },
              { key: 'overdue', label: 'Gecikmiş', count: stats.overdue },
            ].map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: filterStatus === filter.key ? colors.primary : 'transparent',
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setFilterStatus(filter.key as any)}
              >
                <ThemedText
                  style={[
                    styles.filterButtonText,
                    {
                      color: filterStatus === filter.key ? 'white' : colors.text,
                    },
                  ]}
                >
                  {filter.label} ({filter.count})
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Aşı Takvimi Grafiği */}
      <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
        <ThemedText style={styles.chartTitle}>Aşı Takvimi Geçmişi</ThemedText>
        <LineChart
          data={timelineData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          bezier
          withInnerLines={true}
          withOuterLines={true}
        />
      </View>

      {/* Yaklaşan Aşılar */}
      {upcomingVaccines.length > 0 && (
        <View style={[styles.upcomingContainer, { backgroundColor: colors.card }]}>
          <View style={styles.upcomingHeader}>
            <Ionicons name="calendar-outline" size={20} color="#4A90E2" />
            <ThemedText style={styles.upcomingTitle}>Yaklaşan Aşılar</ThemedText>
          </View>
          {upcomingVaccines.map((vaccine) => {
            const badge = getImportanceBadge(vaccine.importance);
            return (
              <TouchableOpacity
                key={vaccine.id}
                style={styles.upcomingItem}
                onPress={() => {
                  setSelectedVaccine(vaccine);
                  setShowDetailModal(true);
                }}
              >
                <View style={styles.upcomingItemLeft}>
                  <Ionicons
                    name={getStatusIcon(vaccine.status) as any}
                    size={16}
                    color={getStatusColor(vaccine.status)}
                  />
                  <View style={styles.upcomingItemInfo}>
                    <ThemedText style={styles.upcomingItemName}>
                      {vaccine.name}
                    </ThemedText>
                    <ThemedText style={styles.upcomingItemDate}>
                      {new Date(vaccine.dueDate).toLocaleDateString('tr-TR')}
                    </ThemedText>
                  </View>
                </View>
                <View style={[styles.importanceBadge, { backgroundColor: badge.color }]}>
                  <ThemedText style={styles.importanceBadgeText}>
                    {badge.text}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Gecikmiş Aşılar */}
      {overdueVaccines.length > 0 && (
        <View style={[styles.overdueContainer, { backgroundColor: colors.card }]}>
          <View style={styles.overdueHeader}>
            <Ionicons name="warning-outline" size={20} color="#FF6B6B" />
            <ThemedText style={styles.overdueTitle}>Gecikmiş Aşılar</ThemedText>
          </View>
          {overdueVaccines.slice(0, 3).map((vaccine) => {
            const daysOverdue = Math.floor(
              (new Date().getTime() - new Date(vaccine.dueDate).getTime()) / (1000 * 60 * 60 * 24)
            );
            return (
              <TouchableOpacity
                key={vaccine.id}
                style={styles.overdueItem}
                onPress={() => {
                  setSelectedVaccine(vaccine);
                  setShowDetailModal(true);
                }}
              >
                <ThemedText style={styles.overdueItemName}>{vaccine.name}</ThemedText>
                <ThemedText style={styles.overdueItemDays}>
                  {daysOverdue} gün gecikmiş
                </ThemedText>
              </TouchableOpacity>
            );
          })}
          {overdueVaccines.length > 3 && (
            <ThemedText style={styles.overdueMoreText}>
              +{overdueVaccines.length - 3} daha fazla
            </ThemedText>
          )}
        </View>
      )}

      {/* Aşı Listesi */}
      <View style={[styles.vaccinationList, { backgroundColor: colors.card }]}>
        <ThemedText style={styles.vaccinationListTitle}>Aşı Listesi</ThemedText>
        {filteredVaccinations.map((vaccine, index) => (
          <TouchableOpacity
            key={vaccine.id}
            style={[
              styles.vaccinationItem,
              { borderBottomColor: colors.border, borderBottomWidth: index < filteredVaccinations.length - 1 ? 1 : 0 },
            ]}
            onPress={() => {
              setSelectedVaccine(vaccine);
              setShowDetailModal(true);
            }}
          >
            <View style={styles.vaccinationItemLeft}>
              <Ionicons
                name={getStatusIcon(vaccine.status) as any}
                size={20}
                color={getStatusColor(vaccine.status)}
              />
              <View style={styles.vaccinationItemInfo}>
                <ThemedText style={styles.vaccinationItemName}>
                  {vaccine.name}
                </ThemedText>
                <ThemedText style={styles.vaccinationItemAge}>
                  {vaccine.recommendedAge}
                </ThemedText>
              </View>
            </View>
            <View style={styles.vaccinationItemRight}>
              {vaccine.administeredDate ? (
                <ThemedText style={styles.vaccinationItemCompleted}>
                  ✅ {new Date(vaccine.administeredDate).toLocaleDateString('tr-TR')}
                </ThemedText>
              ) : (
                <ThemedText style={styles.vaccinationItemDue}>
                  {new Date(vaccine.dueDate).toLocaleDateString('tr-TR')}
                </ThemedText>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Detay Modal */}
      <Modal
        visible={showDetailModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.detailModal, { backgroundColor: colors.background }]}>
          {selectedVaccine && (
            <>
              <View style={styles.detailHeader}>
                <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
                <ThemedText style={styles.detailTitle}>Aşı Detayları</ThemedText>
                <View style={{ width: 24 }} />
              </View>

              <ScrollView style={styles.detailContent}>
                <View style={[styles.detailSection, { backgroundColor: colors.card }]}>
                  <ThemedText style={styles.detailSectionTitle}>{selectedVaccine.name}</ThemedText>
                  <View style={styles.detailBadge}>
                    <View style={[styles.importanceBadge, { backgroundColor: getImportanceBadge(selectedVaccine.importance).color }]}>
                      <ThemedText style={styles.importanceBadgeText}>
                        {getImportanceBadge(selectedVaccine.importance).text}
                      </ThemedText>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedVaccine.status) }]}>
                      <ThemedText style={styles.statusBadgeText}>
                        {selectedVaccine.status === 'completed' ? 'Tamamlandı' :
                         selectedVaccine.status === 'pending' ? 'Bekliyor' :
                         selectedVaccine.status === 'overdue' ? 'Gecikmiş' : 'Yaklaşan'}
                      </ThemedText>
                    </View>
                  </View>
                </View>

                <View style={[styles.detailSection, { backgroundColor: colors.card }]}>
                  <ThemedText style={styles.detailSectionTitle}>Bilgiler</ThemedText>
                  <ThemedText style={styles.detailText}>
                    <ThemedText style={styles.detailLabel}>Aşı Türü:</ThemedText> {selectedVaccine.vaccineType}
                  </ThemedText>
                  <ThemedText style={styles.detailText}>
                    <ThemedText style={styles.detailLabel}>Önerilen Yaş:</ThemedText> {selectedVaccine.recommendedAge}
                  </ThemedText>
                  <ThemedText style={styles.detailText}>
                    <ThemedText style={styles.detailLabel}>Tarih:</ThemedText> {new Date(selectedVaccine.dueDate).toLocaleDateString('tr-TR')}
                  </ThemedText>
                  {selectedVaccine.administeredDate && (
                    <ThemedText style={styles.detailText}>
                      <ThemedText style={styles.detailLabel}>Uygulama Tarihi:</ThemedText> {new Date(selectedVaccine.administeredDate).toLocaleDateString('tr-TR')}
                    </ThemedText>
                  )}
                </View>

                <View style={[styles.detailSection, { backgroundColor: colors.card }]}>
                  <ThemedText style={styles.detailSectionTitle}>Açıklama</ThemedText>
                  <ThemedText style={styles.detailDescription}>{selectedVaccine.description}</ThemedText>
                </View>

                <View style={[styles.detailSection, { backgroundColor: colors.card }]}>
                  <ThemedText style={styles.detailSectionTitle}>Olası Yan Etkiler</ThemedText>
                  {selectedVaccine.sideEffects.map((effect, index) => (
                    <ThemedText key={index} style={styles.sideEffectItem}>• {effect}</ThemedText>
                  ))}
                </View>

                {selectedVaccine.status !== 'completed' && (
                  <View style={styles.detailActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.primary }]}
                      onPress={() => {
                        setSelectedDate(new Date());
                        setShowDatePicker(true);
                      }}
                    >
                      <ThemedText style={styles.actionButtonText}>Aşıyı Yaptı</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}
                      onPress={handleScheduleReminder}
                    >
                      <ThemedText style={[styles.actionButtonText, { color: colors.text }]}>
                        Hatırlatıcı Planla
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            </>
          )}
        </View>
      </Modal>

      {/* Tarih Seçici */}
      {showDatePicker && (
        <View style={styles.datePickerContainer}>
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setSelectedDate(selectedDate);
                handleVaccinationComplete();
              }
            }}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.7,
  },
  filterContainer: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  filterButtons: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartContainer: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  upcomingContainer: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  upcomingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  upcomingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  upcomingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  upcomingItemInfo: {
    marginLeft: 12,
    flex: 1,
  },
  upcomingItemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  upcomingItemDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  importanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  importanceBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  overdueContainer: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  overdueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  overdueTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  overdueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  overdueItemName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  overdueItemDays: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  overdueMoreText: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 10,
  },
  vaccinationList: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  vaccinationListTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  vaccinationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  vaccinationItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vaccinationItemInfo: {
    marginLeft: 12,
    flex: 1,
  },
  vaccinationItemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  vaccinationItemAge: {
    fontSize: 12,
    opacity: 0.7,
  },
  vaccinationItemRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  vaccinationItemCompleted: {
    fontSize: 12,
    color: '#95E77E',
    fontWeight: '600',
  },
  vaccinationItemDue: {
    fontSize: 12,
    opacity: 0.8,
  },
  detailModal: {
    flex: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  detailContent: {
    flex: 1,
    padding: 20,
  },
  detailSection: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  detailBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  detailText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  detailLabel: {
    fontWeight: '600',
  },
  detailDescription: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.9,
  },
  sideEffectItem: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
  detailActions: {
    gap: 12,
    marginTop: 10,
  },
  actionButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  datePickerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});