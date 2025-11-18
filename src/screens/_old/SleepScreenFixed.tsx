import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDatabase } from '../hooks/useDatabase';
import { notificationService } from '../services/NotificationService';

const SleepScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const {
    currentBaby,
    sleepSessions,
    todayStats,
    loading,
    startSleepSession,
    endSleepSession,
    initializeData,
  } = useDatabase();

  const [isSleeping, setIsSleeping] = useState(false);
  const [activeSleepId, setActiveSleepId] = useState<number | null>(null);
  const [sleepStartTime, setSleepStartTime] = useState<Date | null>(null);
  const [currentSleepDuration, setCurrentSleepDuration] = useState('00:00:00');

  // Simüle edilmiş uyku kayıtları (fallback)
  const [sleepRecords, setSleepRecords] = useState([
    {
      id: 1,
      date: 'Bugün',
      startTime: '14:30',
      endTime: '16:45',
      duration: '2 saat 15 dakika',
      quality: 'İyi',
    },
    {
      id: 2,
      date: 'Bugün',
      startTime: '09:00',
      endTime: '10:30',
      duration: '1 saat 30 dakika',
      quality: 'Orta',
    },
    {
      id: 3,
      date: 'Dün',
      startTime: '13:15',
      endTime: '15:00',
      duration: '1 saat 45 dakika',
      quality: 'İyi',
    },
    {
      id: 4,
      date: 'Dün',
      startTime: '20:00',
      endTime: '06:30',
      duration: '10 saat 30 dakika',
      quality: 'Çok İyi',
    },
  ]);

  const sleepTips = [
    {
      id: 1,
      title: 'Uyku Ortamı',
      description: 'Oda sıcaklığı 20-22°C, loş ve sessiz olmalı',
      icon: 'home',
      color: '#007AFF',
    },
    {
      id: 2,
      title: 'Uyku Rutini',
      description: 'Her gün aynı saatte uyandırın ve yatırın',
      icon: 'time',
      color: '#34C759',
    },
    {
      id: 3,
      title: 'Beslenme',
      description: 'Yatmadan 1 saat önce süt verme',
      icon: 'restaurant',
      color: '#FF9500',
    },
    {
      id: 4,
      title: 'Güvenlik',
      description: 'Bebeği sırt üstü yatırın, yatakta oyuncak olmasın',
      icon: 'shield',
      color: '#FF3B30',
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSleeping && sleepStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = now.getTime() - sleepStartTime.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setCurrentSleepDuration(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSleeping, sleepStartTime]);

  const handleStartSleep = async () => {
    if (!currentBaby) {
      Alert.alert('Hata', 'Önce bebek profili oluşturun');
      return;
    }

    try {
      const startTime = new Date().toISOString();
      const session = {
        babyId: currentBaby.id,
        startTime,
        quality: 'good' as const,
        notes: '',
      };

      const result = await startSleepSession(session).unwrap();
      setIsSleeping(true);
      setSleepStartTime(new Date());
      setActiveSleepId(result.id);
      
      // Show notification
      notificationService.notifySleepStarted(currentBaby.name);
      
      Alert.alert('Uyku Başladı', 'Bebeğinizin uykusu başladı. Takip ediliyor...');
    } catch (error) {
      Alert.alert('Hata', 'Uyku kaydı başarısız oldu');
      console.error('Failed to start sleep session:', error);
    }
  };

  const handleEndSleep = async () => {
    if (!activeSleepId || !sleepStartTime || !currentBaby) return;

    try {
      const endTime = new Date();
      const endTimeStr = endTime.toISOString();
      const duration = Math.floor((endTime.getTime() - sleepStartTime.getTime()) / 1000);
      const durationStr = calculateDuration(sleepStartTime, endTime);

      await endSleepSession(activeSleepId, endTimeStr, duration, 'good').unwrap();
      
      setIsSleeping(false);
      setSleepStartTime(null);
      setActiveSleepId(null);
      setCurrentSleepDuration('00:00:00');
      
      // Show notification
      notificationService.notifySleepEnded(currentBaby.name, durationStr);
      
      Alert.alert('Uyku Bitti', `Uyku süresi: ${durationStr}`);
    } catch (error) {
      Alert.alert('Hata', 'Uyku kaydı güncellenemedi');
      console.error('Failed to end sleep session:', error);
    }
  };

  const calculateDuration = (start: Date, end: Date): string => {
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours} saat ${minutes} dakika`;
    }
    return `${minutes} dakika`;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} saat ${minutes} dakika`;
    }
    return `${minutes} dakika`;
  };

  const SleepRecordCard = ({ record }: any) => (
    <View style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <View style={styles.recordTime}>
          <Ionicons name="time" size={16} color="#636E72" />
          <Text style={styles.recordTimeText}>
            {record.startTime} - {record.endTime}
          </Text>
        </View>
        <View style={[styles.qualityBadge, { backgroundColor: getQualityColor(record.quality) }]}>
          <Text style={styles.qualityText}>{record.quality}</Text>
        </View>
      </View>
      <View style={styles.recordDetails}>
        <Text style={styles.recordDuration}>{record.duration}</Text>
        <Text style={styles.recordDate}>{record.date}</Text>
      </View>
    </View>
  );

  const getQualityColor = (quality: string): string => {
    switch (quality) {
      case 'Çok İyi': return '#34C759';
      case 'İyi': return '#007AFF';
      case 'Orta': return '#FF9500';
      case 'Kaydedildi': return '#8E8E93';
      default: return '#FF3B30';
    }
  };

  const SleepTipCard = ({ tip }: any) => (
    <View style={styles.tipCard}>
      <View style={styles.tipHeader}>
        <Ionicons name={tip.icon as any} size={24} color={tip.color} />
        <Text style={styles.tipTitle}>{tip.title}</Text>
      </View>
      <Text style={styles.tipDescription}>{tip.description}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Uyku Takibi</Text>
        <Text style={styles.subtitle}>Bebeğinizin uyku düzenini izleyin</Text>
      </View>

      <View style={styles.sleepTrackerSection}>
        <View style={styles.currentSleepCard}>
          {isSleeping ? (
            <View style={styles.activeSleepContainer}>
              <View style={styles.sleepingIndicator}>
                <Ionicons name="moon" size={32} color="#007AFF" />
                <Text style={styles.sleepingText}>UYUYOR</Text>
              </View>
              <Text style={styles.currentDuration}>{currentSleepDuration}</Text>
              <TouchableOpacity 
                style={[styles.sleepButton, styles.endButton]} 
                onPress={handleEndSleep}
              >
                <Ionicons name="stop" size={20} color="white" />
                <Text style={styles.sleepButtonText}>Uykuyu Bitir</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.readySleepContainer}>
              <Ionicons name="bed" size={48} color="#8E8E93" />
              <Text style={styles.readyText}>Uyku takibi hazır</Text>
              <TouchableOpacity 
                style={[styles.sleepButton, styles.startButton]} 
                onPress={handleStartSleep}
              >
                <Ionicons name="play" size={20} color="white" />
                <Text style={styles.sleepButtonText}>Uykuyu Başlat</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Bugünkü Toplam</Text>
            <Text style={styles.statValue}>{formatDuration(todayStats.sleepDuration)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Ortalama Uyku</Text>
            <Text style={styles.statValue}>14-17 saat</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Uyku Kayıtları</Text>
        {sleepSessions.length > 0 ? (
          sleepSessions.map((session) => (
            <SleepRecordCard 
              key={session.id} 
              record={{
                id: session.id!,
                date: new Date(session.startTime).toLocaleDateString('tr-TR'),
                startTime: new Date(session.startTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                endTime: session.endTime ? new Date(session.endTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : 'Devam ediyor',
                duration: session.duration ? formatDuration(session.duration) : 'Devam ediyor',
                quality: session.quality === 'excellent' ? 'Çok İyi' : 
                         session.quality === 'good' ? 'İyi' : 
                         session.quality === 'fair' ? 'Orta' : 'Zayıf',
              }} 
            />
          ))
        ) : (
          sleepRecords.map((record) => (
            <SleepRecordCard key={record.id} record={record} />
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Uyku İpuçları</Text>
        {sleepTips.map((tip) => (
          <SleepTipCard key={tip.id} tip={tip} />
        ))}
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#007AFF" />
          <Text style={styles.infoText}>
            Yenidoğan bebekler günde 14-17 saat uyurlar. Uyku düzeni aydan aya değişir.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#636E72',
  },
  sleepTrackerSection: {
    padding: 20,
  },
  currentSleepCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeSleepContainer: {
    alignItems: 'center',
  },
  sleepingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sleepingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginLeft: 8,
  },
  currentDuration: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 20,
  },
  readySleepContainer: {
    alignItems: 'center',
  },
  readyText: {
    fontSize: 16,
    color: '#636E72',
    marginTop: 12,
    marginBottom: 20,
  },
  sleepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  startButton: {
    backgroundColor: '#007AFF',
  },
  endButton: {
    backgroundColor: '#FF3B30',
  },
  sleepButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statTitle: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 16,
  },
  recordCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordTimeText: {
    fontSize: 14,
    color: '#636E72',
    marginLeft: 4,
  },
  qualityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  qualityText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  recordDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordDuration: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  recordDate: {
    fontSize: 14,
    color: '#636E72',
  },
  tipCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginLeft: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
  },
  infoSection: {
    padding: 20,
    paddingBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1565C0',
    marginLeft: 8,
    lineHeight: 20,
  },
});

export default SleepScreen;