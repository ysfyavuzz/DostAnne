import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addActivity } from '../store/appSlice';
import { RootState } from '../store/store';
import SleepAnalysisChart from '../components/charts/SleepAnalysisChart';

const SleepScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { activities, baby } = useSelector((state: RootState) => state.activities);
  const [isSleeping, setIsSleeping] = useState(false);
  const [sleepStartTime, setSleepStartTime] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [chartPeriod, setChartPeriod] = useState<'7' | '30' | '90'>('7');

  useEffect(() => {
    // Check if there's an ongoing sleep session
    const ongoingSleep = activities
      .filter(a => a.type === 'sleep' && !a.endTime)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0];
    
    if (ongoingSleep) {
      setIsSleeping(true);
      setSleepStartTime(new Date(ongoingSleep.startTime));
    }
  }, [activities]);

  const handleStartSleep = () => {
    const now = new Date();
    setSleepStartTime(now);
    setIsSleeping(true);

    const sleepActivity = {
      id: Date.now().toString(),
      type: 'sleep' as const,
      startTime: now.toISOString(),
      endTime: null,
      quantity: null,
      notes: 'Uyku başladı',
    };

    dispatch(addActivity(sleepActivity));
    
    if (enableNotifications) {
      console.log('Wake-up reminder scheduled');
    }
  };

  const handleEndSleep = () => {
    if (!sleepStartTime) return;

    const endTime = new Date();
    const duration = endTime.getTime() - sleepStartTime.getTime();
    const durationMinutes = Math.round(duration / (1000 * 60));

    Alert.alert(
      'Uyku Kaydı',
      `Uyku süresi: ${Math.floor(durationMinutes / 60)} saat ${durationMinutes % 60} dakika\n\nKaydı tamamlamak istiyor musunuz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Tamamla',
          onPress: () => completeSleepSession(endTime),
        },
      ]
    );
  };

  const completeSleepSession = (endTime: Date) => {
    const ongoingSleep = activities
      .filter(a => a.type === 'sleep' && !a.endTime)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0];

    if (ongoingSleep) {
      const updatedActivity = {
        ...ongoingSleep,
        endTime: endTime.toISOString(),
        notes: notes || 'Uyku tamamlandı',
      };

      dispatch(addActivity(updatedActivity));
    }

    setIsSleeping(false);
    setSleepStartTime(null);
    setNotes('');
  };

  const formatDuration = (startDate: Date) => {
    const now = new Date();
    const duration = now.getTime() - startDate.getTime();
    const minutes = Math.floor(duration / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Uyku Takibi</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Current Sleep Status */}
      <View style={styles.statusContainer}>
        {isSleeping && sleepStartTime ? (
          <View style={styles.sleepingStatus}>
            <View style={styles.sleepingIndicator}>
              <Ionicons name="moon" size={24} color="#9F7AEA" />
              <Text style={styles.sleepingText}>Uyuyor</Text>
            </View>
            <Text style={styles.sleepDuration}>
              Başlangıç: {sleepStartTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Text style={styles.sleepDuration}>
              Süre: {formatDuration(sleepStartTime)}
            </Text>
            <TouchableOpacity style={styles.endSleepButton} onPress={handleEndSleep}>
              <Ionicons name="stop" size={20} color="white" />
              <Text style={styles.endSleepText}>Uykuyu Bitir</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.awakeStatus}>
            <View style={styles.awakeIndicator}>
              <Ionicons name="sunny" size={24} color="#F6AD55" />
              <Text style={styles.awakeText}>Uyanık</Text>
            </View>
            <TouchableOpacity style={styles.startSleepButton} onPress={handleStartSleep}>
              <Ionicons name="play" size={20} color="white" />
              <Text style={styles.startSleepText}>Uykuyu Başlat</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Sleep Analysis Chart */}
      <SleepAnalysisChart
        period={chartPeriod}
        onPeriodChange={setChartPeriod}
      />

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
        
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F0E6FF' }]}>
            <Ionicons name="add-circle" size={20} color="#9F7AEA" />
            <Text style={styles.actionButtonText}>Manuel Kayıt</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FFF0F5' }]}>
            <Ionicons name="calendar" size={20} color="#FF6B9D" />
            <Text style={styles.actionButtonText}>Planla</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#E6FFFA' }]}>
            <Ionicons name="analytics" size={20} color="#48BB78" />
            <Text style={styles.actionButtonText}>Rapor</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sleep Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.sectionTitle}>Uyku İpuçları</Text>
        
        <View style={styles.tipItem}>
          <View style={[styles.tipIcon, { backgroundColor: '#F0E6FF' }]}>
            <Ionicons name="bulb" size={16} color="#9F7AEA" />
          </View>
          <Text style={styles.tipText}>
            Bebekler genellikle günde 14-17 saat uyurlar. Yaşa göre uyku ihtiyacı değişir.
          </Text>
        </View>

        <View style={styles.tipItem}>
          <View style={[styles.tipIcon, { backgroundColor: '#FFF0F5' }]}>
            <Ionicons name="moon" size={16} color="#FF6B9D" />
          </View>
          <Text style={styles.tipText}>
            Düzenli uyku saatleri bebek için önemlidir. Her gün aynı saatlerde yatırmaya çalışın.
          </Text>
        </View>

        <View style={styles.tipItem}>
          <View style={[styles.tipIcon, { backgroundColor: '#E6FFFA' }]}>
            <Ionicons name="eye" size={16} color="#48BB78" />
          </View>
          <Text style={styles.tipText}>
            Uyku sinyallerini gözlemleyin: gözlerini ovuşturma, huzursuzluk, sık ağlama.
          </Text>
        </View>

        <View style={styles.tipItem}>
          <View style={[styles.tipIcon, { backgroundColor: '#FEF5E7' }]}>
            <Ionicons name="bed" size={16} color="#F6AD55" />
          </View>
          <Text style={styles.tipText}>
            Uyku ortamı karanlık, sessiz ve serin olmalıdır. Beyaz ses uyumaya yardımcı olabilir.
          </Text>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>Ayarlar</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications" size={20} color="#9F7AEA" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Uyku Hatırlatıcıları</Text>
              <Text style={styles.settingDescription}>Uyanma zamanı bildirimleri</Text>
            </View>
          </View>
          <Switch
            value={enableNotifications}
            onValueChange={setEnableNotifications}
            trackColor={{ false: '#E2E8F0', true: '#FED7E2' }}
            thumbColor={enableNotifications ? '#FF6B9D' : '#A0AEC0'}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#9F7AEA',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    margin: 20,
    marginBottom: 10,
  },
  sleepingStatus: {
    backgroundColor: '#F0E6FF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  sleepingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sleepingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9F7AEA',
    marginLeft: 8,
  },
  sleepDuration: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  endSleepButton: {
    flexDirection: 'row',
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  endSleepText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  awakeStatus: {
    backgroundColor: '#FEF5E7',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  awakeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  awakeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F6AD55',
    marginLeft: 8,
  },
  startSleepButton: {
    flexDirection: 'row',
    backgroundColor: '#48BB78',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  startSleepText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  quickActionsContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginBottom: 10,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 15,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4A5568',
    marginTop: 6,
    textAlign: 'center',
  },
  tipsContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginBottom: 10,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  tipIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#4A5568',
    lineHeight: 18,
  },
  settingsContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginBottom: 40,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3748',
  },
  settingDescription: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
});

export default SleepScreen;