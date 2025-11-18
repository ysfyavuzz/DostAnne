import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useDatabase } from '../hooks/useDatabase';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import OneHandedMode from '../components/OneHandedMode';

const { width } = Dimensions.get('window');

type FeedingType = 'breast' | 'bottle' | 'solid';
type BreastSide = 'left' | 'right' | null;

interface FeedingSession {
  id: string;
  type: FeedingType;
  side?: BreastSide;
  startTime: string;
  endTime?: string;
  duration: number;
  amount?: number;
  notes?: string;
}

interface SideStats {
  duration: number;
  amount: number;
  count: number;
}

// Animated Bottle Component
const AnimatedBottle = ({ 
  side, 
  isActive, 
  duration, 
  amount 
}: { 
  side: 'left' | 'right'; 
  isActive: boolean; 
  duration: number; 
  amount: number;
}) => {
  const flowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const liquidAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      // Flow animation (liquid flowing)
      Animated.loop(
        Animated.sequence([
          Animated.timing(flowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(flowAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Liquid fill animation
      Animated.timing(liquidAnim, {
        toValue: Math.min(amount / 200, 1), // Max 200ml for visual
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      flowAnim.setValue(0);
      pulseAnim.setValue(1);
    }
  }, [isActive, amount]);

  const flowTranslateY = flowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120],
  });

  const flowOpacity = flowAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.5, 0],
  });

  const liquidHeight = liquidAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '80%'],
  });

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <View style={[styles.bottleContainer, side === 'right' && styles.bottleContainerRight]}>
      {/* Timer above bottle */}
      {duration > 0 && (
        <View style={[styles.timerBadge, isActive && styles.timerBadgeActive]}>
          <Text style={[styles.timerBadgeText, isActive && styles.timerBadgeTextActive]}>
            {formatTime(duration)}
          </Text>
        </View>
      )}

      {/* Bottle */}
      <Animated.View 
        style={[
          styles.bottle, 
          { transform: [{ scale: pulseAnim }] },
          isActive && styles.bottleActive
        ]}
      >
        {/* Liquid inside bottle */}
        <Animated.View 
          style={[
            styles.liquidFill, 
            { 
              height: liquidHeight,
              backgroundColor: isActive ? '#FFE5F0' : '#F0F0F0'
            }
          ]} 
        />
        
        {/* Bottle icon overlay */}
        <View style={styles.bottleIconContainer}>
          <Ionicons 
            name="water" 
            size={60} 
            color={isActive ? '#FF69B4' : '#CCCCCC'} 
          />
        </View>
      </Animated.View>

      {/* Tube/Pipe */}
      <View style={styles.tube}>
        {/* Animated milk drops flowing */}
        {isActive && (
          <>
            <Animated.View
              style={[
                styles.milkDrop,
                {
                  transform: [{ translateY: flowTranslateY }],
                  opacity: flowOpacity,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.milkDrop,
                {
                  transform: [{ translateY: flowTranslateY }],
                  opacity: flowOpacity,
                  top: 20,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.milkDrop,
                {
                  transform: [{ translateY: flowTranslateY }],
                  opacity: flowOpacity,
                  top: 40,
                },
              ]}
            />
          </>
        )}
      </View>

      {/* Stats below bottle */}
      <View style={styles.bottleStats}>
        <Text style={[styles.bottleStatText, isActive && styles.bottleStatTextActive]}>
          {amount}ml
        </Text>
      </View>
    </View>
  );
};

export default function FeedingScreenNew() {
  const { colors, spacing, borderRadius, typography, shadows } = useThemedStyles();
  const { startFeedingSession, endFeedingSession } = useDatabase();
  const currentBaby = useSelector((state: RootState) => state.database.currentBaby);
  const activities = useSelector((state: RootState) => state.database.activities);

  // Timer state
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // One-handed mode state
  const [oneHandedMode, setOneHandedMode] = useState(false);

  // Feeding type state
  const [feedingType, setFeedingType] = useState<FeedingType>('breast');
  const [breastSide, setBreastSide] = useState<BreastSide>('left');

  // Separate stats for each side
  const [leftStats, setLeftStats] = useState<SideStats>({ duration: 0, amount: 0, count: 0 });
  const [rightStats, setRightStats] = useState<SideStats>({ duration: 0, amount: 0, count: 0 });

  // Modal state
  const [showEndModal, setShowEndModal] = useState(false);
  const [notes, setNotes] = useState('');

  // Scale animation for baby
  const babyScale = useRef(new Animated.Value(1)).current;

  // Update stats based on active side
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        if (breastSide === 'left') {
          setLeftStats(prev => ({ 
            ...prev, 
            duration: prev.duration + 1,
            amount: prev.amount + 0.5 // Estimate 0.5ml per second
          }));
        } else if (breastSide === 'right') {
          setRightStats(prev => ({ 
            ...prev, 
            duration: prev.duration + 1,
            amount: prev.amount + 0.5
          }));
        }
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, breastSide]);

  // Baby feeding animation
  useEffect(() => {
    if (isActive && !isPaused) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(babyScale, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(babyScale, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      babyScale.setValue(1);
    }
  }, [isActive, isPaused]);

  // Start feeding session
  const handleStart = async (side?: 'left' | 'right') => {
    if (!currentBaby?.id) {
      Alert.alert('Hata', 'Lütfen önce bir bebek profili oluşturun');
      return;
    }

    // If side is provided (from OneHandedMode), use it
    const activeSide = side || breastSide;
    if (side) {
      setBreastSide(side);
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const newSessionId = await startFeedingSession({
        type: feedingType,
        side: feedingType === 'breast' ? activeSide : undefined,
        amount: 0,
      });

      setSessionId(newSessionId);
      setIsActive(true);
      setIsPaused(false);
      
      // Increment count for the active side
      if (activeSide === 'left') {
        setLeftStats(prev => ({ ...prev, count: prev.count + 1 }));
      } else if (activeSide === 'right') {
        setRightStats(prev => ({ ...prev, count: prev.count + 1 }));
      }
    } catch (error) {
      console.error('Error starting feeding session:', error);
      Alert.alert('Hata', 'Emzirme oturumu başlatılamadı');
    }
  };

  // Pause/Resume
  const handlePauseResume = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsPaused(!isPaused);
  };

  // Separate pause function for OneHandedMode
  const handlePause = () => {
    handlePauseResume();
  };

  // Stop and save
  const handleStop = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowEndModal(true);
  };

  // Quick swap breast sides
  const handleSwapSide = async () => {
    if (feedingType === 'breast' && isActive) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      
      // Pause current side
      setIsPaused(true);
      
      // Switch side
      const newSide = breastSide === 'left' ? 'right' : 'left';
      setBreastSide(newSide);
      
      // Increment count for new side
      if (newSide === 'left') {
        setLeftStats(prev => ({ ...prev, count: prev.count + 1 }));
      } else {
        setRightStats(prev => ({ ...prev, count: prev.count + 1 }));
      }
      
      // Resume after 1 second
      setTimeout(() => {
        setIsPaused(false);
        Alert.alert('Taraf Değiştirildi', `${newSide === 'left' ? 'Sol' : 'Sağ'} tarafa geçildi`);
      }, 1000);
    }
  };

  const handleSave = async () => {
    if (!sessionId) return;

    try {
      const totalAmount = Math.round(leftStats.amount + rightStats.amount);
      
      await endFeedingSession(sessionId, {
        amount: totalAmount,
        notes: notes.trim() || undefined,
      });

      // Reset state
      setIsActive(false);
      setIsPaused(false);
      setSessionId(null);
      setNotes('');
      setShowEndModal(false);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Başarılı', 'Emzirme oturumu kaydedildi');
    } catch (error) {
      console.error('Error ending feeding session:', error);
      Alert.alert('Hata', 'Emzirme oturumu kaydedilemedi');
    }
  };

  // Calculate today's total stats
  const todayStats = useMemo(() => {
    const today = new Date().toDateString();
    const todayFeedings = activities.filter(
      (a) => a.type === 'feeding' && new Date(a.startTime).toDateString() === today
    );

    const totalDuration = todayFeedings.reduce((sum, a) => {
      const start = new Date(a.startTime);
      const end = a.endTime ? new Date(a.endTime) : new Date();
      return sum + Math.floor((end.getTime() - start.getTime()) / 1000);
    }, 0);

    const totalAmount = todayFeedings.reduce((sum, a) => {
      return sum + (a.details?.amount || 0);
    }, 0);

    return {
      count: todayFeedings.length,
      duration: totalDuration,
      amount: totalAmount,
    };
  }, [activities]);

  const totalCurrentDuration = leftStats.duration + rightStats.duration;
  const totalCurrentAmount = Math.round(leftStats.amount + rightStats.amount);
  const totalCurrentCount = leftStats.count + rightStats.count;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* One-Handed Mode Toggle - Top Right */}
      <View style={styles.headerControls}>
        <TouchableOpacity
          style={[styles.oneHandedToggle, oneHandedMode && styles.oneHandedToggleActive]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setOneHandedMode(!oneHandedMode);
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name="hand-left"
            size={20}
            color={oneHandedMode ? '#FFFFFF' : '#6B7280'}
          />
          <Text style={[styles.oneHandedToggleText, oneHandedMode && styles.oneHandedToggleTextActive]}>
            Tek El
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conditional Rendering: One-Handed Mode or Full UI */}
      {oneHandedMode ? (
        <OneHandedMode
          onStartLeft={() => handleStart('left')}
          onStartRight={() => handleStart('right')}
          onStop={handleStop}
          onPause={handlePause}
          isActive={isActive}
          isPaused={isPaused}
          currentSide={breastSide}
          duration={breastSide === 'left' ? leftStats.duration : rightStats.duration}
        />
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Main Visual Card */}
        <LinearGradient
          colors={isActive ? colors.gradients.pink : colors.gradients.blue}
          style={[styles.visualCard, { borderRadius: borderRadius.xl }, shadows.medium]}
        >
          <Text style={[styles.mainTitle, typography.h2, { color: 'white' }]}>
            {isActive ? 'Emzirme Devam Ediyor' : 'Emzirme Takibi'}
          </Text>

          {/* Feeding Type Selector (only when not active) */}
          {!isActive && (
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  feedingType === 'breast' && styles.typeButtonActive,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setFeedingType('breast');
                }}
              >
                <Ionicons
                  name="person"
                  size={24}
                  color={feedingType === 'breast' ? colors.primary[500] : 'white'}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    { color: feedingType === 'breast' ? colors.primary[500] : 'white' },
                  ]}
                >
                  Anne Sütü
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  feedingType === 'bottle' && styles.typeButtonActive,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setFeedingType('bottle');
                }}
              >
                <Ionicons
                  name="water-outline"
                  size={24}
                  color={feedingType === 'bottle' ? colors.primary[500] : 'white'}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    { color: feedingType === 'bottle' ? colors.primary[500] : 'white' },
                  ]}
                >
                  Biberon
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Dual Bottle Visualization */}
          {feedingType === 'breast' && (
            <View style={styles.visualContainer}>
              {/* Left Bottle */}
              <AnimatedBottle 
                side="left" 
                isActive={isActive && !isPaused && breastSide === 'left'}
                duration={leftStats.duration}
                amount={Math.round(leftStats.amount)}
              />

              {/* Baby in the middle */}
              <View style={styles.babyContainer}>
                <Animated.View style={{ transform: [{ scale: babyScale }] }}>
                  <Ionicons 
                    name="person" 
                    size={80} 
                    color={isActive ? '#FF69B4' : '#FFFFFF'} 
                  />
                </Animated.View>
                <Text style={styles.babyLabel}>Bebek</Text>
              </View>

              {/* Right Bottle */}
              <AnimatedBottle 
                side="right" 
                isActive={isActive && !isPaused && breastSide === 'right'}
                duration={rightStats.duration}
                amount={Math.round(rightStats.amount)}
              />
            </View>
          )}

          {/* Side selector when not active */}
          {!isActive && feedingType === 'breast' && (
            <View style={styles.sideSelector}>
              <TouchableOpacity
                style={[
                  styles.sideButton,
                  breastSide === 'left' && styles.sideButtonActive,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setBreastSide('left');
                }}
              >
                <Text style={[styles.sideButtonText, breastSide === 'left' && styles.sideButtonTextActive]}>
                  🍼 Sol Taraf
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sideButton,
                  breastSide === 'right' && styles.sideButtonActive,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setBreastSide('right');
                }}
              >
                <Text style={[styles.sideButtonText, breastSide === 'right' && styles.sideButtonTextActive]}>
                  Sağ Taraf 🍼
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Control Buttons */}
          <View style={styles.controlButtons}>
            {!isActive ? (
              <TouchableOpacity
                style={[styles.startButton, { backgroundColor: 'white' }]}
                onPress={handleStart}
              >
                <Ionicons name="play" size={28} color={colors.primary[500]} />
                <Text style={[styles.startButtonText, { color: colors.primary[500] }]}>
                  Başlat
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.controlButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                  onPress={handlePauseResume}
                >
                  <Ionicons name={isPaused ? 'play' : 'pause'} size={24} color="white" />
                  <Text style={[styles.controlButtonText, { color: 'white' }]}>
                    {isPaused ? 'Devam' : 'Duraklat'}
                  </Text>
                </TouchableOpacity>

                {feedingType === 'breast' && (
                  <TouchableOpacity
                    style={[styles.controlButton, { backgroundColor: 'rgba(255,255,255,0.3)' }]}
                    onPress={handleSwapSide}
                  >
                    <Ionicons name="swap-horizontal" size={24} color="white" />
                    <Text style={[styles.controlButtonText, { color: 'white' }]}>
                      Değiştir
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.controlButton, { backgroundColor: 'white' }]}
                  onPress={handleStop}
                >
                  <Ionicons name="stop" size={24} color={colors.primary[500]} />
                  <Text style={[styles.controlButtonText, { color: colors.primary[500] }]}>
                    Bitir
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </LinearGradient>

        {/* Total Stats (Merge Point) */}
        <View style={[styles.totalStatsCard, { backgroundColor: 'white' }, shadows.medium]}>
          <View style={styles.totalStatsHeader}>
            <Ionicons name="stats-chart" size={28} color={colors.primary[500]} />
            <Text style={[styles.totalStatsTitle, typography.h3, { color: colors.text }]}>
              Toplam İstatistikler
            </Text>
          </View>

          <View style={styles.totalStatsGrid}>
            <View style={styles.totalStatItem}>
              <View style={[styles.totalStatIconContainer, { backgroundColor: colors.primary[100] }]}>
                <Ionicons name="time" size={32} color={colors.primary[500]} />
              </View>
              <Text style={[styles.totalStatValue, typography.h2, { color: colors.text }]}>
                {Math.floor(totalCurrentDuration / 60)}:{String(totalCurrentDuration % 60).padStart(2, '0')}
              </Text>
              <Text style={[styles.totalStatLabel, typography.caption, { color: colors.textSecondary }]}>
                Toplam Süre
              </Text>
            </View>

            <View style={styles.totalStatItem}>
              <View style={[styles.totalStatIconContainer, { backgroundColor: colors.secondary[100] }]}>
                <Ionicons name="water" size={32} color={colors.secondary[500]} />
              </View>
              <Text style={[styles.totalStatValue, typography.h2, { color: colors.text }]}>
                {totalCurrentAmount}
              </Text>
              <Text style={[styles.totalStatLabel, typography.caption, { color: colors.textSecondary }]}>
                Mililitre (ml)
              </Text>
            </View>

            <View style={styles.totalStatItem}>
              <View style={[styles.totalStatIconContainer, { backgroundColor: colors.success[100] }]}>
                <Ionicons name="restaurant" size={32} color={colors.success[500]} />
              </View>
              <Text style={[styles.totalStatValue, typography.h2, { color: colors.text }]}>
                {totalCurrentCount}
              </Text>
              <Text style={[styles.totalStatLabel, typography.caption, { color: colors.textSecondary }]}>
                Ziyade Sayısı
              </Text>
            </View>
          </View>

          {/* Individual Side Stats */}
          <View style={styles.sideStatsContainer}>
            <View style={styles.sideStatCard}>
              <Text style={[styles.sideStatTitle, { color: colors.primary[500] }]}>🍼 Sol Taraf</Text>
              <Text style={[styles.sideStatValue, { color: colors.text }]}>
                {Math.floor(leftStats.duration / 60)}:{String(leftStats.duration % 60).padStart(2, '0')}
              </Text>
              <Text style={[styles.sideStatDetail, { color: colors.textSecondary }]}>
                {Math.round(leftStats.amount)}ml • {leftStats.count} ziyade
              </Text>
            </View>

            <View style={styles.sideStatCard}>
              <Text style={[styles.sideStatTitle, { color: colors.secondary[500] }]}>Sağ Taraf 🍼</Text>
              <Text style={[styles.sideStatValue, { color: colors.text }]}>
                {Math.floor(rightStats.duration / 60)}:{String(rightStats.duration % 60).padStart(2, '0')}
              </Text>
              <Text style={[styles.sideStatDetail, { color: colors.textSecondary }]}>
                {Math.round(rightStats.amount)}ml • {rightStats.count} ziyade
              </Text>
            </View>
          </View>
        </View>

        {/* Today's History Stats */}
        <View style={[styles.historyCard, { backgroundColor: 'white' }, shadows.small]}>
          <Text style={[styles.historyTitle, typography.h3, { color: colors.text }]}>
            Bugünün Geçmişi
          </Text>

          <View style={styles.historyStatsGrid}>
            <View style={styles.historyStatItem}>
              <Ionicons name="restaurant" size={28} color={colors.activity.feeding} />
              <Text style={[styles.historyStatValue, typography.h3, { color: colors.text }]}>
                {todayStats.count}
              </Text>
              <Text style={[styles.historyStatLabel, typography.caption, { color: colors.textSecondary }]}>
                Toplam Oturum
              </Text>
            </View>

            <View style={styles.historyStatItem}>
              <Ionicons name="time-outline" size={28} color={colors.activity.sleep} />
              <Text style={[styles.historyStatValue, typography.h3, { color: colors.text }]}>
                {Math.floor(todayStats.duration / 60)}dk
              </Text>
              <Text style={[styles.historyStatLabel, typography.caption, { color: colors.textSecondary }]}>
                Bugünkü Süre
              </Text>
            </View>

            <View style={styles.historyStatItem}>
              <Ionicons name="water" size={28} color={colors.primary[500]} />
              <Text style={[styles.historyStatValue, typography.h3, { color: colors.text }]}>
                {todayStats.amount}ml
              </Text>
              <Text style={[styles.historyStatLabel, typography.caption, { color: colors.textSecondary }]}>
                Bugünkü Miktar
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      )}
      {/* End of conditional rendering */}

      {/* End Session Modal */}
      <Modal
        visible={showEndModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEndModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: 'white' }, shadows.large]}>
            <Text style={[styles.modalTitle, typography.h2, { color: colors.text }]}>
              Emzirme Tamamlandı! 🎉
            </Text>

            <View style={styles.modalStats}>
              <View style={styles.modalStatItem}>
                <Ionicons name="time" size={32} color={colors.primary[500]} />
                <Text style={[styles.modalStatValue, typography.h3, { color: colors.text }]}>
                  {Math.floor(totalCurrentDuration / 60)}:{String(totalCurrentDuration % 60).padStart(2, '0')}
                </Text>
                <Text style={[styles.modalStatLabel, typography.caption, { color: colors.textSecondary }]}>
                  Toplam Süre
                </Text>
              </View>

              <View style={styles.modalStatItem}>
                <Ionicons name="water" size={32} color={colors.secondary[500]} />
                <Text style={[styles.modalStatValue, typography.h3, { color: colors.text }]}>
                  {totalCurrentAmount}ml
                </Text>
                <Text style={[styles.modalStatLabel, typography.caption, { color: colors.textSecondary }]}>
                  Toplam Miktar
                </Text>
              </View>

              <View style={styles.modalStatItem}>
                <Ionicons name="restaurant" size={32} color={colors.success[500]} />
                <Text style={[styles.modalStatValue, typography.h3, { color: colors.text }]}>
                  {totalCurrentCount}
                </Text>
                <Text style={[styles.modalStatLabel, typography.caption, { color: colors.textSecondary }]}>
                  Ziyade Sayısı
                </Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.neutral[200] }]}
                onPress={() => setShowEndModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSave}>
                <LinearGradient
                  colors={colors.gradients.pink}
                  style={styles.modalButton}
                >
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
  visualCard: {
    marginTop: 16,
    padding: 24,
    alignItems: 'center',
  },
  mainTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    width: '100%',
  },
  typeButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: 'white',
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  visualContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 24,
    paddingHorizontal: 8,
  },
  bottleContainer: {
    alignItems: 'center',
    width: 80,
  },
  bottleContainerRight: {
    alignItems: 'center',
  },
  timerBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  timerBadgeActive: {
    backgroundColor: 'white',
  },
  timerBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  timerBadgeTextActive: {
    color: '#FF69B4',
  },
  bottle: {
    width: 70,
    height: 100,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  bottleActive: {
    borderColor: '#FFB6C1',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  liquidFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  bottleIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tube: {
    width: 4,
    height: 120,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginVertical: 8,
    borderRadius: 2,
    position: 'relative',
    overflow: 'visible',
  },
  milkDrop: {
    position: 'absolute',
    left: -2,
    top: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFE5F0',
  },
  bottleStats: {
    marginTop: 8,
  },
  bottleStatText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  bottleStatTextActive: {
    color: 'white',
    fontSize: 16,
  },
  babyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  babyLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  sideSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    width: '100%',
  },
  sideButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  sideButtonActive: {
    backgroundColor: 'white',
  },
  sideButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  sideButtonTextActive: {
    color: '#FF69B4',
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 12,
  },
  startButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 8,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: '700',
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 6,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalStatsCard: {
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
  },
  totalStatsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  totalStatsTitle: {
    flex: 1,
  },
  totalStatsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  totalStatItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  totalStatIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalStatValue: {
    marginBottom: 4,
  },
  totalStatLabel: {
    textAlign: 'center',
  },
  sideStatsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  sideStatCard: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    alignItems: 'center',
  },
  sideStatTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  sideStatValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  sideStatDetail: {
    fontSize: 12,
    textAlign: 'center',
  },
  historyCard: {
    marginTop: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
  },
  historyTitle: {
    marginBottom: 16,
  },
  historyStatsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  historyStatItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  historyStatValue: {
    marginTop: 8,
    marginBottom: 4,
  },
  historyStatLabel: {
    textAlign: 'center',
  },
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
  modalStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  modalStatItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  modalStatValue: {
    marginTop: 8,
    marginBottom: 4,
  },
  modalStatLabel: {
    textAlign: 'center',
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
  // One-Handed Mode Styles
  headerControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  oneHandedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
  },
  oneHandedToggleActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  oneHandedToggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  oneHandedToggleTextActive: {
    color: '#FFFFFF',
  },
});
