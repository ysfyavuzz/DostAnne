import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useDatabase } from '../hooks/useDatabase';

type SleepQuality = 'excellent' | 'good' | 'fair' | 'poor';

const SleepScreenNew = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { colors, typography, spacing, borderRadius, shadows, isDark } = useThemedStyles();
  const { startSleepSession, endSleepSession } = useDatabase();
  
  const currentBaby = useSelector((state: RootState) => state.database.currentBaby);
  const sleepSessions = useSelector((state: RootState) => state.database.sleepSessions);
  
  const [isActive, setIsActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<SleepQuality>('good');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStart = useCallback(async () => {
    if (!currentBaby?.id) {
      Alert.alert('Uyarı', 'Lütfen önce bebek profili oluşturun');
      return;
    }

    const now = new Date();
    setStartTime(now);
    setIsActive(true);
    setIsPaused(false);
    setElapsedSeconds(0);

    try {
      const result = await startSleepSession({
        babyId: currentBaby.id,
        startTime: now.toISOString(),
        quality: 'good',
      });
      
      if (result.payload && typeof result.payload === 'object' && 'id' in result.payload) {
        setCurrentSessionId((result.payload as any).id);
      }
    } catch (error) {
      console.error('Failed to start sleep session:', error);
    }
  }, [currentBaby, startSleepSession]);

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setModalVisible(true);
  };

  const handleSaveSession = async () => {
    if (!currentSessionId || !startTime) return;

    const endTimeDate = new Date();
    const duration = Math.floor(elapsedSeconds / 60); // minutes

    try {
      await endSleepSession(currentSessionId, endTimeDate.toISOString(), duration, selectedQuality);
      
      setIsActive(false);
      setIsPaused(false);
      setElapsedSeconds(0);
      setStartTime(null);
      setCurrentSessionId(null);
      setModalVisible(false);
      
      Alert.alert('Başarılı', 'Uyku seansı kaydedildi!');
    } catch (error) {
      Alert.alert('Hata', 'Uyku seansı kaydedilemedi');
      console.error(error);
    }
  };

  // Today's stats
  const todayStats = useMemo(() => {
    const today = new Date().toDateString();
    const todaySessions = sleepSessions.filter(s => 
      new Date(s.startTime).toDateString() === today && s.endTime
    );

    const totalMinutes = todaySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    const avgMinutes = todaySessions.length > 0 ? Math.floor(totalMinutes / todaySessions.length) : 0;
    const avgHours = Math.floor(avgMinutes / 60);
    const avgMins = avgMinutes % 60;

    return {
      count: todaySessions.length,
      totalHours,
      totalMinutes: remainingMinutes,
      avgHours,
      avgMinutes: avgMins,
    };
  }, [sleepSessions]);

  const getQualityEmoji = (quality: SleepQuality) => {
    switch (quality) {
      case 'excellent': return '😄';
      case 'good': return '😊';
      case 'fair': return '😐';
      case 'poor': return '😔';
    }
  };

  const getQualityLabel = (quality: SleepQuality) => {
    switch (quality) {
      case 'excellent': return 'Mükemmel';
      case 'good': return 'İyi';
      case 'fair': return 'Orta';
      case 'poor': return 'Kötü';
    }
  };

  const stylesObj = styles(colors, typography, spacing, borderRadius, shadows, isDark);

  return (
    <View style={stylesObj.container}>
      <ScrollView>
        {/* Timer Card */}
        <View style={stylesObj.section}>
          <LinearGradient
            colors={isActive ? colors.gradients.primary : colors.gradients.secondary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={stylesObj.timerCard}
          >
            <Ionicons 
              name={isActive ? "moon" : "moon-outline"} 
              size={48} 
              color="white" 
            />
            
            <Text style={stylesObj.timerStatus}>
              {isActive ? (isPaused ? '⏸️ DURAKLATILDI' : '🌙 UYUYOR') : '💤 UYKU TAKİBİ'}
            </Text>
            
            <Text style={stylesObj.timerText}>{formatTime(elapsedSeconds)}</Text>
            
            {startTime && (
              <Text style={stylesObj.timerSubtext}>
                Başladı: {startTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            )}

            <View style={stylesObj.timerButtons}>
              {!isActive ? (
                <TouchableOpacity style={stylesObj.startButton} onPress={handleStart}>
                  <Ionicons name="play" size={28} color="white" />
                  <Text style={stylesObj.buttonText}>Başlat</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity 
                    style={[stylesObj.controlButton, stylesObj.pauseButton]} 
                    onPress={handlePause}
                  >
                    <Ionicons name={isPaused ? "play" : "pause"} size={24} color="white" />
                    <Text style={stylesObj.controlButtonText}>
                      {isPaused ? 'Devam' : 'Duraklat'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[stylesObj.controlButton, stylesObj.stopButton]} 
                    onPress={handleStop}
                  >
                    <Ionicons name="stop" size={24} color="white" />
                    <Text style={stylesObj.controlButtonText}>Bitir</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Today's Stats */}
        <View style={stylesObj.section}>
          <Text style={stylesObj.sectionTitle}>📊 Bugün</Text>
          <View style={stylesObj.statsCard}>
            <View style={stylesObj.statItem}>
              <Ionicons name="time" size={32} color={colors.primary[500]} />
              <Text style={stylesObj.statValue}>
                {todayStats.totalHours}s {todayStats.totalMinutes}d
              </Text>
              <Text style={stylesObj.statLabel}>Toplam Uyku</Text>
            </View>

            <View style={stylesObj.statDivider} />

            <View style={stylesObj.statItem}>
              <Ionicons name="moon" size={32} color={colors.secondary[500]} />
              <Text style={stylesObj.statValue}>{todayStats.count}</Text>
              <Text style={stylesObj.statLabel}>Uyku Seansı</Text>
            </View>

            <View style={stylesObj.statDivider} />

            <View style={stylesObj.statItem}>
              <Ionicons name="stats-chart" size={32} color={colors.success[500]} />
              <Text style={stylesObj.statValue}>
                {todayStats.avgHours}s {todayStats.avgMinutes}d
              </Text>
              <Text style={stylesObj.statLabel}>Ortalama</Text>
            </View>
          </View>
        </View>

        {/* Recent Sleep Sessions */}
        <View style={stylesObj.section}>
          <Text style={stylesObj.sectionTitle}>📅 Son Uyku Kayıtları</Text>
          {sleepSessions.length > 0 ? (
            <View style={stylesObj.sessionsList}>
              {sleepSessions.slice(-10).reverse().map((session) => {
                if (!session.endTime) return null;
                
                const start = new Date(session.startTime);
                const end = new Date(session.endTime);
                const durationHours = Math.floor((session.duration || 0) / 60);
                const durationMinutes = (session.duration || 0) % 60;

                return (
                  <View key={session.id} style={stylesObj.sessionItem}>
                    <View style={[stylesObj.sessionIcon, { backgroundColor: colors.activity.sleep + '20' }]}>
                      <Ionicons name="moon" size={24} color={colors.activity.sleep} />
                    </View>
                    
                    <View style={stylesObj.sessionContent}>
                      <Text style={stylesObj.sessionTime}>
                        {start.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} - {' '}
                        {end.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                      <Text style={stylesObj.sessionDuration}>
                        {durationHours > 0 ? `${durationHours}s ` : ''}{durationMinutes}d | {' '}
                        {getQualityLabel(session.quality)} {getQualityEmoji(session.quality)}
                      </Text>
                      {session.notes && (
                        <Text style={stylesObj.sessionNotes}>{session.notes}</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={stylesObj.emptyState}>
              <Ionicons name="moon-outline" size={64} color={colors.neutral[300]} />
              <Text style={stylesObj.emptyText}>Henüz uyku kaydı yok</Text>
            </View>
          )}
        </View>

        <View style={{ height: spacing['4xl'] }} />
      </ScrollView>

      {/* Quality Selection Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={stylesObj.modalOverlay}>
          <View style={stylesObj.modalContent}>
            <Text style={stylesObj.modalTitle}>Uyku Kalitesi</Text>
            <Text style={stylesObj.modalSubtitle}>Bu uyku seansının kalitesini değerlendirin</Text>

            <View style={stylesObj.qualityOptions}>
              {(['excellent', 'good', 'fair', 'poor'] as SleepQuality[]).map((quality) => (
                <TouchableOpacity
                  key={quality}
                  style={[
                    stylesObj.qualityOption,
                    selectedQuality === quality && stylesObj.qualityOptionActive
                  ]}
                  onPress={() => setSelectedQuality(quality)}
                >
                  <Text style={stylesObj.qualityEmoji}>{getQualityEmoji(quality)}</Text>
                  <Text style={[
                    stylesObj.qualityLabel,
                    selectedQuality === quality && stylesObj.qualityLabelActive
                  ]}>
                    {getQualityLabel(quality)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={stylesObj.modalButtons}>
              <TouchableOpacity 
                style={stylesObj.modalButtonCancel} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={stylesObj.modalButtonTextCancel}>İptal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={stylesObj.modalButtonSave} onPress={handleSaveSession}>
                <LinearGradient
                  colors={colors.gradients.success}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={stylesObj.modalButtonGradient}
                >
                  <Text style={stylesObj.modalButtonText}>Kaydet</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = (colors: any, typography: any, spacing: any, borderRadius: any, shadows: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? colors.background.dark : colors.background.light,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing['2xl'],
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  timerCard: {
    borderRadius: borderRadius['2xl'],
    padding: spacing['3xl'],
    alignItems: 'center',
    ...shadows.lg,
  },
  timerStatus: {
    ...typography.h4,
    color: 'white',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  timerText: {
    ...typography.display,
    color: 'white',
    fontWeight: '800',
    marginVertical: spacing.md,
  },
  timerSubtext: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.lg,
  },
  timerButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
  },
  pauseButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  stopButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
  },
  buttonText: {
    ...typography.button,
    color: 'white',
  },
  controlButtonText: {
    ...typography.label,
    color: 'white',
    fontWeight: '600',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: isDark ? colors.background.cardDark : 'white',
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h4,
    color: colors.text.primary,
    fontWeight: '700',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.neutral[200],
    marginHorizontal: spacing.sm,
  },
  sessionsList: {
    gap: spacing.md,
  },
  sessionItem: {
    flexDirection: 'row',
    backgroundColor: isDark ? colors.background.cardDark : 'white',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  sessionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  sessionContent: {
    flex: 1,
  },
  sessionTime: {
    ...typography.labelLarge,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sessionDuration: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  sessionNotes: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  emptyState: {
    padding: spacing['4xl'],
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.lg,
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
  modalTitle: {
    ...typography.h3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  qualityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing['2xl'],
  },
  qualityOption: {
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: 'transparent',
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  qualityOptionActive: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  qualityEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  qualityLabel: {
    ...typography.label,
    color: colors.text.secondary,
  },
  qualityLabelActive: {
    color: colors.primary[500],
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalButtonCancel: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderColor: colors.neutral[300],
    alignItems: 'center',
  },
  modalButtonTextCancel: {
    ...typography.button,
    color: colors.text.secondary,
  },
  modalButtonSave: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  modalButtonGradient: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  modalButtonText: {
    ...typography.button,
    color: 'white',
  },
});

export default React.memo(SleepScreenNew);
