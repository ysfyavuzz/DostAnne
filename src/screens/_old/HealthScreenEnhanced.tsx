import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/hooks/useTheme';
import { createText } from '@/src/components/ThemedText';
import { createView } from '@/src/components/ThemedView';
import { useDatabase } from '@/src/hooks/useDatabase';
import { useNotifications } from '@/src/hooks/useNotifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import HealthMetricsDashboard from '@/src/components/charts/HealthMetricsDashboard';
import VaccinationScheduleChart from '@/src/components/charts/VaccinationScheduleChart';

const ThemedText = createText();
const ThemedView = createView();
const { width: screenWidth } = Dimensions.get('window');

interface HealthRecord {
  id: number;
  type: 'temperature' | 'weight' | 'height' | 'vaccination' | 'checkup' | 'medication';
  value: number;
  unit: string;
  notes: string;
  timestamp: Date;
}

interface HealthMetric {
  date: string;
  temperature: number;
  weight: number;
  height: number;
  healthScore: number;
}

interface VaccinationRecord {
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

export default function HealthScreenEnhanced() {
  const { colors } = useTheme();
  const { addHealthRecord, getHealthRecords, deleteRecord } = useDatabase();
  const { scheduleHealthReminder } = useNotifications();
  
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [showVaccinationModal, setShowVaccinationModal] = useState(false);
  const [healthType, setHealthType] = useState<'temperature' | 'weight' | 'height' | 'checkup'>('temperature');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'temperature' | 'weight' | 'height' | 'score'>('temperature');

  // Sample vaccination data - gerçek uygulamada database'den gelecek
  const [vaccinations] = useState<VaccinationRecord[]>([
    {
      id: '1',
      name: 'Hepatit B (Doğum)',
      vaccineType: 'Hepatit B',
      recommendedAge: 'Doğum',
      dueDate: '2024-01-01',
      administeredDate: '2024-01-01',
      status: 'completed',
      importance: 'critical',
      description: 'Hepatit B enfeksiyonuna karşı koruma sağlar',
      sideEffects: ['Hafif ateş', 'Aşı yerinde kızarıklık', 'Hafif hassasiyet'],
    },
    {
      id: '2',
      name: 'BCG',
      vaccineType: 'Tüberküloz',
      recommendedAge: '2. ay',
      dueDate: '2024-03-01',
      administeredDate: '2024-03-05',
      status: 'completed',
      importance: 'critical',
      description: 'Tüberküloz hastalığına karşı koruma sağlar',
      sideEffects: ['Aşı yerinde şişlik', 'Küçük yara oluşumu'],
    },
    {
      id: '3',
      name: 'DaBT-IPA-Hib',
      vaccineType: 'Kombine',
      recommendedAge: '2. ay',
      dueDate: '2024-03-01',
      administeredDate: '2024-03-05',
      status: 'completed',
      importance: 'critical',
      description: 'Difteri, boğmaca, tetanos, polio, HiB enfeksiyonlarına karşı koruma',
      sideEffects: ['Hafif ateş', 'Huzursuzluk', 'Aşı yerinde ağrı'],
    },
    {
      id: '4',
      name: 'DaBT-IPA-Hib',
      vaccineType: 'Kombine',
      recommendedAge: '4. ay',
      dueDate: '2024-05-01',
      status: 'overdue',
      importance: 'critical',
      description: 'Difteri, boğmaca, tetanos, polio, HiB enfeksiyonlarına karşı koruma (2. doz)',
      sideEffects: ['Hafif ateş', 'Huzursuzluk', 'Aşı yerinde ağrı'],
    },
    {
      id: '5',
      name: 'Prevenar',
      vaccineType: 'Pnömokok',
      recommendedAge: '2. ay',
      dueDate: '2024-03-01',
      administeredDate: '2024-03-05',
      status: 'completed',
      importance: 'important',
      description: 'Pnömokok bakterilerine bağlı enfeksiyonlara karşı koruma',
      sideEffects: ['Hafif ateş', 'Aşı yerinde kızarıklık', 'İştah kaybı'],
    },
  ]);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const healthRecords = await getHealthRecords();
      setRecords(healthRecords);
    } catch (error) {
      Alert.alert('Hata', 'Sağlık kayıtları yüklenemedi');
    }
  };

  const getHealthMetricsData = (): HealthMetric[] => {
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayRecords = records.filter(record => {
        const recordDate = new Date(record.timestamp);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate.getTime() === date.getTime();
      });
      
      const temperature = dayRecords.find(r => r.type === 'temperature')?.value || 36.5;
      const weight = dayRecords.find(r => r.type === 'weight')?.value || 4;
      const height = dayRecords.find(r => r.type === 'height')?.value || 55;
      const healthScore = calculateHealthScore(temperature, weight, height, new Date(date).getTime());
      
      last30Days.push({
        date: date.toISOString(),
        temperature,
        weight,
        height,
        healthScore,
      });
    }
    
    return last30Days;
  };

  const calculateHealthScore = (temp: number, weight: number, height: number, date: number): number => {
    const daysOld = Math.floor((new Date().getTime() - date) / (1000 * 60 * 60 * 24));
    
    let score = 50; // Base score
    
    // Temperature score (36.0-37.5 is ideal)
    if (temp >= 36.0 && temp <= 37.5) score += 20;
    else if (temp >= 35.5 && temp <= 38.0) score += 10;
    else score -= 10;
    
    // Weight score (age-appropriate)
    const expectedWeight = 3.5 + (daysOld * 0.02); // Simple formula
    if (Math.abs(weight - expectedWeight) < 0.5) score += 20;
    else if (Math.abs(weight - expectedWeight) < 1.0) score += 10;
    else score -= 10;
    
    // Height score (age-appropriate)
    const expectedHeight = 50 + (daysOld * 0.2); // Simple formula
    if (Math.abs(height - expectedHeight) < 2) score += 10;
    else score -= 5;
    
    return Math.max(0, Math.min(100, score));
  };

  const handleAddRecord = async () => {
    if (!value) {
      Alert.alert('Hata', 'Lütfen değeri girin');
      return;
    }

    try {
      const newRecord: Omit<HealthRecord, 'id'> = {
        type: healthType,
        value: parseFloat(value),
        unit: healthType === 'temperature' ? '°C' : healthType === 'weight' ? 'kg' : 'cm',
        notes: notes.trim(),
        timestamp: selectedDate,
      };

      await addHealthRecord(newRecord);
      
      if (notificationEnabled && healthType === 'checkup') {
        const nextCheckup = new Date(selectedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        await scheduleHealthReminder('Kontrol Zamanı!', 'Bir sonraki sağlık kontrolü zamanı geldi.', nextCheckup);
      }

      await loadRecords();
      setShowAddModal(false);
      resetForm();
      Alert.alert('Başarılı', 'Sağlık kaydı eklendi');
    } catch (error) {
      Alert.alert('Hata', 'Kayıt eklenemedi');
    }
  };

  const handleDeleteRecord = async (id: number) => {
    Alert.alert(
      'Emin misiniz?',
      'Bu sağlık kaydını silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecord(id);
              await loadRecords();
              Alert.alert('Başarılı', 'Kayıt silindi');
            } catch (error) {
              Alert.alert('Hata', 'Kayıt silinemedi');
            }
          },
        },
      ]
    );
  };

  const handleVaccinationUpdate = (id: string, administeredDate: string) => {
    // Burada aşı güncelleme mantığı olacak
    Alert.alert('Başarılı', 'Aşı bilgileri güncellendi');
  };

  const handleScheduleReminder = (id: string, date: string) => {
    // Burada hatırlatıcı planlama mantığı olacak
    Alert.alert('Başarılı', 'Hatırlatıcı planlandı');
  };

  const resetForm = () => {
    setHealthType('temperature');
    setValue('');
    setNotes('');
    setSelectedDate(new Date());
  };

  const getTodayStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayRecords = records.filter(record => {
      const recordDate = new Date(record.timestamp);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === today.getTime();
    });

    const temperature = todayRecords.find(r => r.type === 'temperature')?.value;
    const weight = todayRecords.find(r => r.type === 'weight')?.value;
    const height = todayRecords.find(r => r.type === 'height')?.value;
    const healthScore = calculateHealthScore(
      temperature || 36.5,
      weight || 4,
      height || 55,
      today.getTime()
    );

    return {
      temperature,
      weight,
      height,
      healthScore,
      totalRecords: todayRecords.length,
    };
  };

  const getHealthTypeIcon = (type: string) => {
    switch (type) {
      case 'temperature': return '🌡️';
      case 'weight': return '⚖️';
      case 'height': return '📏';
      case 'vaccination': return '💉';
      case 'checkup': return '🩺';
      case 'medication': return '💊';
      default: return '📋';
    }
  };

  const getHealthTypeLabel = (type: string) => {
    switch (type) {
      case 'temperature': return 'Vücut Isısı';
      case 'weight': return 'Kilo';
      case 'height': return 'Boy';
      case 'vaccination': return 'Aşı';
      case 'checkup': return 'Kontrol';
      case 'medication': return 'İlaç';
      default: return 'Sağlık';
    }
  };

  const stats = getTodayStats();
  const healthData = getHealthMetricsData();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>🏥 Sağlık Takibi</ThemedText>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowDashboardModal(true)}
            >
              <Ionicons name="analytics-outline" size={16} color="white" />
              <ThemedText style={styles.headerButtonText}>Analiz</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: '#4ECDC4' }]}
              onPress={() => setShowVaccinationModal(true)}
            >
              <Ionicons name="medical-outline" size={16} color="white" />
              <ThemedText style={styles.headerButtonText}>Aşılar</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Genel Sağlık Durumu */}
        <View style={[styles.healthScoreCard, { backgroundColor: colors.card }]}>
          <View style={styles.healthScoreHeader}>
            <Ionicons name="heart" size={24} color="#FF6B6B" />
            <ThemedText style={styles.healthScoreTitle}>Genel Sağlık Skoru</ThemedText>
          </View>
          <ThemedText style={styles.healthScoreValue}>
            {Math.round(stats.healthScore)}/100
          </ThemedText>
          <ThemedText style={styles.healthScoreStatus}>
            {stats.healthScore >= 80 ? 'Mükemmel' : 
             stats.healthScore >= 60 ? 'İyi' : 
             stats.healthScore >= 40 ? 'Orta' : 'Dikkat Edilmeli'}
          </ThemedText>
        </View>

        {/* Bugünkü Ölçümler */}
        <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.cardTitle}>Bugünkü Ölçümler</ThemedText>
          <View style={styles.measurementGrid}>
            <View style={styles.measurementItem}>
              <Ionicons name="thermometer-outline" size={20} color="#FF6B6B" />
              <ThemedText style={styles.measurementValue}>
                {stats.temperature || '-'}°C
              </ThemedText>
              <ThemedText style={styles.measurementLabel}>Sıcaklık</ThemedText>
            </View>
            <View style={styles.measurementItem}>
              <Ionicons name="fitness-outline" size={20} color="#4ECDC4" />
              <ThemedText style={styles.measurementValue}>
                {stats.weight || '-'}kg
              </ThemedText>
              <ThemedText style={styles.measurementLabel}>Kilo</ThemedText>
            </View>
            <View style={styles.measurementItem}>
              <Ionicons name="resize-outline" size={20} color="#95E77E" />
              <ThemedText style={styles.measurementValue}>
                {stats.height || '-'}cm
              </ThemedText>
              <ThemedText style={styles.measurementLabel}>Boy</ThemedText>
            </View>
          </View>
        </View>

        {/* Hızlı Ekleme */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: '#FF6B6B' }]}
            onPress={() => {
              setHealthType('temperature');
              setValue('36.5');
              setShowAddModal(true);
            }}
          >
            <Text style={styles.quickActionEmoji}>🌡️</Text>
            <ThemedText style={styles.quickActionText}>Sıcaklık</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: '#4ECDC4' }]}
            onPress={() => {
              setHealthType('weight');
              setValue('4.5');
              setShowAddModal(true);
            }}
          >
            <Text style={styles.quickActionEmoji}>⚖️</Text>
            <ThemedText style={styles.quickActionText}>Kilo</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: '#95E77E' }]}
            onPress={() => {
              setHealthType('height');
              setValue('60');
              setShowAddModal(true);
            }}
          >
            <Text style={styles.quickActionEmoji}>📏</Text>
            <ThemedText style={styles.quickActionText}>Boy</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: '#4A90E2' }]}
            onPress={() => {
              setHealthType('checkup');
              setShowAddModal(true);
            }}
          >
            <Text style={styles.quickActionEmoji}>🩺</Text>
            <ThemedText style={styles.quickActionText}>Kontrol</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Aşı Durumu */}
        <View style={[styles.vaccinationCard, { backgroundColor: colors.card }]}>
          <View style={styles.vaccinationHeader}>
            <Ionicons name="medical-outline" size={20} color="#4ECDC4" />
            <ThemedText style={styles.vaccinationTitle}>Aşı Durumu</ThemedText>
          </View>
          <View style={styles.vaccinationStats}>
            <View style={styles.vaccinationStat}>
              <ThemedText style={styles.vaccinationStatValue}>
                {vaccinations.filter(v => v.status === 'completed').length}
              </ThemedText>
              <ThemedText style={styles.vaccinationStatLabel}>Tamamlandı</ThemedText>
            </View>
            <View style={styles.vaccinationStat}>
              <ThemedText style={styles.vaccinationStatValue}>
                {vaccinations.filter(v => v.status === 'pending').length}
              </ThemedText>
              <ThemedText style={styles.vaccinationStatLabel}>Bekliyor</ThemedText>
            </View>
            <View style={styles.vaccinationStat}>
              <ThemedText style={[styles.vaccinationStatValue, { color: '#FF6B6B' }]}>
                {vaccinations.filter(v => v.status === 'overdue').length}
              </ThemedText>
              <ThemedText style={styles.vaccinationStatLabel}>Gecikmiş</ThemedText>
            </View>
          </View>
        </View>

        {/* Son Sağlık Kayıtları */}
        <View style={styles.recordsHeader}>
          <ThemedText style={styles.recordsTitle}>Son Sağlık Kayıtları</ThemedText>
        </View>

        {records.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
            <Text style={styles.emptyEmoji}>🏥</Text>
            <ThemedText style={styles.emptyText}>Henüz sağlık kaydı yok</ThemedText>
            <ThemedText style={styles.emptySubText}>
              İlk sağlık kaydını eklemek için butona tıklayın
            </ThemedText>
          </View>
        ) : (
          records.slice(0, 5).map((record) => (
            <View key={record.id} style={[styles.recordItem, { backgroundColor: colors.card }]}>
              <View style={styles.recordLeft}>
                <Text style={styles.recordEmoji}>{getHealthTypeIcon(record.type)}</Text>
                <View style={styles.recordInfo}>
                  <ThemedText style={styles.recordType}>
                    {getHealthTypeLabel(record.type)}
                  </ThemedText>
                  <ThemedText style={styles.recordAmount}>
                    {record.value} {record.unit}
                  </ThemedText>
                  <ThemedText style={styles.recordTime}>
                    {new Date(record.timestamp).toLocaleString('tr-TR')}
                  </ThemedText>
                  {record.notes && (
                    <ThemedText style={styles.recordNotes}>{record.notes}</ThemedText>
                  )}
                </View>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteRecord(record.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Sağlık Önerileri */}
        <View style={[styles.tipsCard, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.cardTitle}>Sağlık Önerileri</ThemedText>
          <View style={styles.tipsList}>
            <ThemedText style={styles.tipItem}>🌡️ Vücut sıcaklığını düzenli olarak ölçün</ThemedText>
            <ThemedText style={styles.tipItem}>⚖️ Kilo ve boy takibini haftalık yapın</ThemedText>
            <ThemedText style={styles.tipItem}>💉 Aşı takvimini düzenli kontrol edin</ThemedText>
            <ThemedText style={styles.tipItem}>🩺 Doktor kontrollerini aksatmayın</ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Ekle Butonu */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Analiz Modal */}
      <Modal
        visible={showDashboardModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowDashboardModal(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <ThemedText style={styles.modalTitle}>Sağlık Analizi</ThemedText>
            <View style={{ width: 24 }} />
          </View>
          <HealthMetricsDashboard
            healthData={healthData}
            vaccinations={vaccinations}
            selectedMetric={selectedMetric}
            onMetricChange={setSelectedMetric}
          />
        </View>
      </Modal>

      {/* Aşı Modal */}
      <Modal
        visible={showVaccinationModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowVaccinationModal(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <ThemedText style={styles.modalTitle}>Aşı Takvimi</ThemedText>
            <View style={{ width: 24 }} />
          </View>
          <VaccinationScheduleChart
            vaccinations={vaccinations}
            onVaccinationUpdate={handleVaccinationUpdate}
            onScheduleReminder={handleScheduleReminder}
          />
        </View>
      </Modal>

      {/* Ekle Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <ThemedText style={styles.modalTitle}>Sağlık Kaydı Ekle</ThemedText>
            <TouchableOpacity onPress={handleAddRecord}>
              <ThemedText style={styles.saveButton}>Kaydet</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Sağlık Türü */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Kayıt Türü</ThemedText>
              <View style={styles.typeButtons}>
                {[
                  { type: 'temperature' as const, label: 'Sıcaklık', emoji: '🌡️' },
                  { type: 'weight' as const, label: 'Kilo', emoji: '⚖️' },
                  { type: 'height' as const, label: 'Boy', emoji: '📏' },
                  { type: 'checkup' as const, label: 'Kontrol', emoji: '🩺' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.type}
                    style={[
                      styles.typeButton,
                      { backgroundColor: healthType === item.type ? colors.primary : colors.card },
                      { borderColor: colors.border },
                    ]}
                    onPress={() => setHealthType(item.type)}
                  >
                    <Text style={styles.typeButtonEmoji}>{item.emoji}</Text>
                    <ThemedText
                      style={[
                        styles.typeButtonText,
                        { color: healthType === item.type ? 'white' : colors.text },
                      ]}
                    >
                      {item.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Değer */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                Değer <Text style={styles.required}>*</Text>
              </ThemedText>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.card, color: colors.text }]}
                value={value}
                onChangeText={setValue}
                placeholder={
                  healthType === 'temperature' ? '36.5' :
                  healthType === 'weight' ? '4.5' :
                  healthType === 'height' ? '60' : ''
                }
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              <ThemedText style={styles.unitHint}>
                Birim: {healthType === 'temperature' ? '°C' : healthType === 'weight' ? 'kg' : 'cm'}
              </ThemedText>
            </View>

            {/* Notlar */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Notlar</ThemedText>
              <TextInput
                style={[
                  styles.textInput,
                  styles.textArea,
                  { backgroundColor: colors.card, color: colors.text },
                ]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Notlarınızı buraya yazın..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setSelectedDate(selectedDate);
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  headerButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  healthScoreCard: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  healthScoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  healthScoreTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  healthScoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  healthScoreStatus: {
    fontSize: 14,
    opacity: 0.8,
  },
  statsCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  measurementGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  measurementItem: {
    alignItems: 'center',
  },
  measurementValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 3,
  },
  measurementLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  quickActionButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
  },
  quickActionEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  vaccinationCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  vaccinationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  vaccinationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  vaccinationStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  vaccinationStat: {
    alignItems: 'center',
  },
  vaccinationStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  vaccinationStatLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  recordsHeader: {
    marginBottom: 15,
  },
  recordsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptyState: {
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  recordItem: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recordEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  recordInfo: {
    flex: 1,
  },
  recordType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  recordAmount: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 2,
  },
  recordTime: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 2,
  },
  recordNotes: {
    fontSize: 12,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  required: {
    color: '#FF6B6B',
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  typeButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  typeButtonEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  textInput: {
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  unitHint: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 5,
  },
  tipsCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  tipsList: {
    gap: 10,
  },
  tipItem: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
});