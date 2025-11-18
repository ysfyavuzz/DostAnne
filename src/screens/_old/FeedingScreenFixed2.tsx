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
import { LineChart } from 'react-native-chart-kit';

const ThemedText = createText();
const ThemedView = createView();
const { width: screenWidth } = Dimensions.get('window');

interface FeedingRecord {
  id: number;
  type: 'breast' | 'bottle' | 'solid';
  amount: number;
  duration?: number;
  notes: string;
  timestamp: Date;
}

export default function FeedingScreenFixed() {
  const { colors } = useTheme();
  const { addFeedingRecord, getFeedingRecords, deleteRecord } = useDatabase();
  const { scheduleFeedingReminder } = useNotifications();
  
  const [records, setRecords] = useState<FeedingRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedingType, setFeedingType] = useState<'breast' | 'bottle' | 'solid'>('breast');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [reminderInterval, setReminderInterval] = useState('3'); // saat

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const feedingRecords = await getFeedingRecords();
      setRecords(feedingRecords);
    } catch (error) {
      Alert.alert('Hata', 'Beslenme kayıtları yüklenemedi');
    }
  };

  const handleAddRecord = async () => {
    if (!amount || (feedingType === 'breast' && !duration)) {
      Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    try {
      const newRecord: Omit<FeedingRecord, 'id'> = {
        type: feedingType,
        amount: parseFloat(amount),
        duration: feedingType === 'breast' ? parseInt(duration) : undefined,
        notes: notes.trim(),
        timestamp: selectedDate,
      };

      await addFeedingRecord(newRecord);
      
      // Bildirim planla
      if (notificationEnabled) {
        const nextReminder = new Date(selectedDate.getTime() + parseInt(reminderInterval) * 60 * 60 * 1000);
        await scheduleFeedingReminder('Beslenme Zamanı!', `${reminderInterval} saatlik beslenme zamanınız geldi.`, nextReminder);
      }

      await loadRecords();
      setShowAddModal(false);
      resetForm();
      Alert.alert('Başarılı', 'Beslenme kaydı eklendi');
    } catch (error) {
      Alert.alert('Hata', 'Kayıt eklenemedi');
    }
  };

  const handleDeleteRecord = async (id: number) => {
    Alert.alert(
      'Emin misiniz?',
      'Bu beslenme kaydını silmek istediğinizden emin misiniz?',
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

  const resetForm = () => {
    setFeedingType('breast');
    setAmount('');
    setDuration('');
    setNotes('');
    setSelectedDate(new Date());
  };

  const getFeedingTypeIcon = (type: string) => {
    switch (type) {
      case 'breast':
        return '🤱';
      case 'bottle':
        return '🍼';
      case 'solid':
        return '🥄';
      default:
        return '🍽️';
    }
  };

  const getFeedingTypeLabel = (type: string) => {
    switch (type) {
      case 'breast':
        return 'Anne Sütü';
      case 'bottle':
        return 'Mama';
      case 'solid':
        return 'Ek Gıda';
      default:
        return 'Beslenme';
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getTodayStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayRecords = records.filter(record => {
      const recordDate = new Date(record.timestamp);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === today.getTime();
    });

    const totalAmount = todayRecords.reduce((sum, record) => sum + record.amount, 0);
    const breastCount = todayRecords.filter(r => r.type === 'breast').length;
    const bottleCount = todayRecords.filter(r => r.type === 'bottle').length;
    const solidCount = todayRecords.filter(r => r.type === 'solid').length;

    return {
      totalAmount,
      totalFeedings: todayRecords.length,
      breastCount,
      bottleCount,
      solidCount,
    };
  };

  const getLastFeedingTime = () => {
    if (records.length === 0) return null;
    const lastRecord = records[records.length - 1];
    return new Date(lastRecord.timestamp);
  };

  const getChartData = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayRecords = records.filter(record => {
        const recordDate = new Date(record.timestamp);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate.getTime() === date.getTime();
      });
      
      const totalAmount = dayRecords.reduce((sum, record) => sum + record.amount, 0);
      last7Days.push({
        day: date.toLocaleDateString('tr-TR', { weekday: 'short' }).slice(0, 3),
        amount: totalAmount,
      });
    }
    
    return {
      labels: last7Days.map(d => d.day),
      datasets: [{
        data: last7Days.map(d => d.amount),
        color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
        strokeWidth: 2,
      }],
    };
  };

  const stats = getTodayStats();
  const lastFeeding = getLastFeedingTime();
  const chartData = getChartData();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>🍼 Beslenme Takibi</ThemedText>
        </View>

        {/* Bugünkü İstatistikler */}
        <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.cardTitle}>Bugün</ThemedText>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{stats.totalAmount} ml</ThemedText>
              <ThemedText style={styles.statLabel}>Toplam Miktar</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{stats.totalFeedings}</ThemedText>
              <ThemedText style={styles.statLabel}>Beslenme Sayısı</ThemedText>
            </View>
          </View>
          
          {lastFeeding && (
            <ThemedText style={styles.lastFeeding}>
              Son Beslenme: {formatTime(lastFeeding)}
            </ThemedText>
          )}
        </View>

        {/* Beslenme Grafiği */}
        {records.length > 0 && (
          <View style={[styles.chartCard, { backgroundColor: colors.card }]}>
            <ThemedText style={styles.cardTitle}>Son 7 Gün</ThemedText>
            <LineChart
              data={chartData}
              width={screenWidth - 40}
              height={200}
              chartConfig={{
                backgroundColor: colors.card,
                backgroundGradientFrom: colors.card,
                backgroundGradientTo: colors.card,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#4A90E2',
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>
        )}

        {/* Beslenme Türleri */}
        <View style={[styles.typesCard, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.cardTitle}>Beslenme Türleri</ThemedText>
          <View style={styles.typesGrid}>
            <View style={styles.typeItem}>
              <Text style={styles.typeEmoji}>🤱</Text>
              <ThemedText style={styles.typeCount}>{stats.breastCount}</ThemedText>
              <ThemedText style={styles.typeLabel}>Anne Sütü</ThemedText>
            </View>
            <View style={styles.typeItem}>
              <Text style={styles.typeEmoji}>🍼</Text>
              <ThemedText style={styles.typeCount}>{stats.bottleCount}</ThemedText>
              <ThemedText style={styles.typeLabel}>Mama</ThemedText>
            </View>
            <View style={styles.typeItem}>
              <Text style={styles.typeEmoji}>🥄</Text>
              <ThemedText style={styles.typeCount}>{stats.solidCount}</ThemedText>
              <ThemedText style={styles.typeLabel}>Ek Gıda</ThemedText>
            </View>
          </View>
        </View>

        {/* Kayıtlar */}
        <View style={styles.recordsHeader}>
          <ThemedText style={styles.recordsTitle}>Beslenme Kayıtları</ThemedText>
        </View>

        {records.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
            <Text style={styles.emptyEmoji}>🍼</Text>
            <ThemedText style={styles.emptyText}>Henüz beslenme kaydı yok</ThemedText>
            <ThemedText style={styles.emptySubText}>
              İlk beslenme kaydını eklemek için butona tıklayın
            </ThemedText>
          </View>
        ) : (
          records.slice(0, 10).map((record) => (
            <View key={record.id} style={[styles.recordItem, { backgroundColor: colors.card }]}>
              <View style={styles.recordLeft}>
                <Text style={styles.recordEmoji}>{getFeedingTypeIcon(record.type)}</Text>
                <View style={styles.recordInfo}>
                  <ThemedText style={styles.recordType}>
                    {getFeedingTypeLabel(record.type)}
                  </ThemedText>
                  <ThemedText style={styles.recordAmount}>
                    {record.amount} ml
                    {record.duration && ` • ${record.duration} dk`}
                  </ThemedText>
                  <ThemedText style={styles.recordTime}>
                    {formatDate(record.timestamp)} • {formatTime(record.timestamp)}
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

        {/* Beslenme Önerileri */}
        <View style={[styles.tipsCard, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.cardTitle}>Beslenme Önerileri</ThemedText>
          <View style={styles.tipsList}>
            <ThemedText style={styles.tipItem}>🥛 Bebeğinizin yaşına uygun süt tüketimini takip edin</ThemedText>
            <ThemedText style={styles.tipItem}>🥄 Yeni yiyeceklere tek tek geçin ve alerjiyi kontrol edin</ThemedText>
            <ThemedText style={styles.tipItem}>🥤 Su tüketimini özellikle sıcak havalarda artırın</ThemedText>
            <ThemedText style={styles.tipItem}>🍎 Meyve ve sebzeleri çeşitlendirin</ThemedText>
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
            <ThemedText style={styles.modalTitle}>Beslenme Ekle</ThemedText>
            <TouchableOpacity onPress={handleAddRecord}>
              <ThemedText style={styles.saveButton}>Kaydet</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Beslenme Türü */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Beslenme Türü</ThemedText>
              <View style={styles.typeButtons}>
                {(['breast', 'bottle', 'solid'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      { backgroundColor: feedingType === type ? colors.primary : colors.card },
                      { borderColor: colors.border },
                    ]}
                    onPress={() => setFeedingType(type)}
                  >
                    <Text style={styles.typeButtonEmoji}>{getFeedingTypeIcon(type)}</Text>
                    <ThemedText
                      style={[
                        styles.typeButtonText,
                        { color: feedingType === type ? 'white' : colors.text },
                      ]}
                    >
                      {getFeedingTypeLabel(type)}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Miktar */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                Miktar (ml) <Text style={styles.required}>*</Text>
              </ThemedText>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.card, color: colors.text }]}
                value={amount}
                onChangeText={setAmount}
                placeholder="Miktar girin"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            {/* Süre (sadece anne sütü için) */}
            {feedingType === 'breast' && (
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>
                  Süre (dakika) <Text style={styles.required}>*</Text>
                </ThemedText>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.card, color: colors.text }]}
                  value={duration}
                  onChangeText={setDuration}
                  placeholder="Süre girin"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            )}

            {/* Tarih ve Saat */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Tarih ve Saat</ThemedText>
              <TouchableOpacity
                style={[styles.dateButton, { backgroundColor: colors.card }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color={colors.text} />
                <ThemedText style={styles.dateButtonText}>
                  {selectedDate.toLocaleString('tr-TR')}
                </ThemedText>
              </TouchableOpacity>
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

            {/* Bildirim Ayarları */}
            <View style={styles.inputGroup}>
              <View style={styles.switchRow}>
                <ThemedText style={styles.inputLabel}>Hatırlatıcı Bildirim</ThemedText>
                <Switch
                  value={notificationEnabled}
                  onValueChange={setNotificationEnabled}
                  trackColor={{ false: '#ccc', true: colors.primary }}
                />
              </View>
              {notificationEnabled && (
                <View style={styles.reminderSettings}>
                  <ThemedText style={styles.inputLabel}>Hatırlatma Aralığı (saat)</ThemedText>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: colors.card, color: colors.text }]}
                    value={reminderInterval}
                    onChangeText={setReminderInterval}
                    placeholder="3"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                </View>
              )}
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
    textAlign: 'center',
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  lastFeeding: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.8,
  },
  chartCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  typesCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  typesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  typeItem: {
    alignItems: 'center',
  },
  typeEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  typeCount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  typeLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  recordsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderSettings: {
    marginTop: 15,
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