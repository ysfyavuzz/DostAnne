import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ImageBackground,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { addActivity } from '../store/store';

const { width, height } = Dimensions.get('window');

const FeedingScreen = () => {
  const { baby } = useSelector((state: RootState) => state.activities);
  const dispatch = useDispatch<AppDispatch>();
  
  const [isFeeding, setIsFeeding] = useState(false);
  const [activeSide, setActiveSide] = useState<'left' | 'right' | null>(null);
  const [leftDuration, setLeftDuration] = useState(0);
  const [rightDuration, setRightDuration] = useState(0);
  const [leftAmount, setLeftAmount] = useState(0);
  const [rightAmount, setRightAmount] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  
  const leftBreastAnim = useRef(new Animated.Value(1)).current;
  const rightBreastAnim = useRef(new Animated.Value(1)).current;
  const milkFlowAnim = useRef(new Animated.Value(0)).current;
  const stomachFillAnim = useRef(new Animated.Value(0)).current;
  
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isFeeding && activeSide) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        updateFeedingData();
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isFeeding, activeSide]);

  const updateFeedingData = () => {
    if (!activeSide) return;
    
    const elapsed = Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000);
    const mlPerSecond = 0.5; // Ortalama 0.5 ml/saniye
    const currentAmount = Math.floor(elapsed * mlPerSecond);
    
    if (activeSide === 'left') {
      setLeftDuration(elapsed);
      setLeftAmount(currentAmount);
    } else {
      setRightDuration(elapsed);
      setRightAmount(currentAmount);
    }
    
    setTotalDuration(leftDuration + rightDuration + (activeSide === 'left' ? elapsed : 0) + (activeSide === 'right' ? elapsed : 0));
    setTotalAmount(leftAmount + rightAmount + (activeSide === 'left' ? currentAmount : 0) + (activeSide === 'right' ? currentAmount : 0));
    
    // Animasyonları güncelle
    updateAnimations();
  };

  const updateAnimations = () => {
    if (activeSide === 'left') {
      Animated.sequence([
        Animated.timing(leftBreastAnim, { toValue: 0.8, duration: 500, useNativeDriver: true }),
        Animated.timing(leftBreastAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start();
      
      Animated.timing(milkFlowAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    } else if (activeSide === 'right') {
      Animated.sequence([
        Animated.timing(rightBreastAnim, { toValue: 0.8, duration: 500, useNativeDriver: true }),
        Animated.timing(rightBreastAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start();
      
      Animated.timing(milkFlowAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    }
    
    // Mide dolum animasyonu
    const fillPercentage = Math.min(totalAmount / 500, 1); // Max 500ml
    Animated.timing(stomachFillAnim, { toValue: fillPercentage, duration: 1000, useNativeDriver: false }).start();
  };

  const startFeeding = (side: 'left' | 'right') => {
    if (!baby) {
      Alert.alert('Bilgi', 'Lütfen önce bebek bilgilerini girin.');
      return;
    }
    
    if (isFeeding && activeSide !== side) {
      Alert.alert('Bilgi', 'Lütfen önce mevcut beslemeyi bitirin.');
      return;
    }
    
    setActiveSide(side);
    setIsFeeding(true);
    
    // Başlangıç animasyonu
    Animated.timing(side === 'left' ? leftBreastAnim : rightBreastAnim, {
      toValue: 0.9,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const stopFeeding = () => {
    if (!isFeeding || !activeSide) return;
    
    setIsFeeding(false);
    
    // Aktiviteyi kaydet
    const activity = {
      id: Date.now().toString(),
      type: 'feeding' as const,
      actor: 'baby' as const,
      startTime: new Date(Date.now() - (activeSide === 'left' ? leftDuration : rightDuration) * 1000).toISOString(),
      endTime: new Date().toISOString(),
      quantity: activeSide === 'left' ? leftAmount : rightAmount,
      unit: 'ml',
      notes: `${activeSide === 'left' ? 'Sol' : 'Sağ'} göğüs - ${activeSide === 'left' ? leftDuration : rightDuration} saniye`,
    };
    
    dispatch(addActivity(activity));
    
    // Animasyonları sıfırla
    Animated.timing(activeSide === 'left' ? leftBreastAnim : rightBreastAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    Animated.timing(milkFlowAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    
    setActiveSide(null);
  };

  const resetSession = () => {
    setIsFeeding(false);
    setActiveSide(null);
    setLeftDuration(0);
    setRightDuration(0);
    setLeftAmount(0);
    setRightAmount(0);
    setTotalDuration(0);
    setTotalAmount(0);
    startTimeRef.current = null;
    
    // Tüm animasyonları sıfırla
    Animated.parallel([
      Animated.timing(leftBreastAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(rightBreastAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(milkFlowAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(stomachFillAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
    ]).start();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const MilkDrop = ({ side }: { side: 'left' | 'right' }) => (
    <Animated.View
      style={[
        styles.milkDrop,
        {
          opacity: milkFlowAnim,
          transform: [
            {
              translateY: milkFlowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 150],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.milkDropInner} />
    </Animated.View>
  );

  const MilkFlow = ({ side }: { side: 'left' | 'right' }) => (
    <View style={[styles.milkFlowContainer, side === 'left' ? styles.leftFlow : styles.rightFlow]}>
      <MilkDrop side={side} />
      {activeSide === side && (
        <Animated.View style={[styles.milkStream, { opacity: milkFlowAnim }]} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Emzirme</Text>
        <TouchableOpacity onPress={resetSession} style={styles.resetButton}>
          <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Baby Info */}
      <View style={styles.babyInfo}>
        <Text style={styles.babyName}>{baby?.name || 'Bebek Adı'}</Text>
        <Text style={styles.sessionInfo}>
          {isFeeding ? 'Besleme Aktif' : 'Yeni Besleme'}
        </Text>
      </View>

      {/* Main Feeding Area */}
      <View style={styles.feedingArea}>
        {/* Sol Göğüs */}
        <View style={styles.breastContainer}>
          <TouchableOpacity
            style={[
              styles.breast,
              styles.leftBreast,
              activeSide === 'left' && styles.activeBreast,
              activeSide === 'right' && styles.inactiveBreast,
            ]}
            onPress={() => activeSide === 'left' ? stopFeeding() : startFeeding('left')}
            disabled={activeSide === 'right'}
          >
            <Animated.View style={[styles.breastInner, { transform: [{ scale: leftBreastAnim }] }]}>
              <View style={styles.breastContent}>
                <Ionicons name="water" size={40} color="#4299E1" />
                <Text style={styles.breastLabel}>Sol</Text>
                <Text style={styles.breastSublabel}>Mavi Kapak</Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
          
          <MilkFlow side="left" />
          
          <View style={styles.breastStats}>
            <Text style={styles.statLabel}>Süre</Text>
            <Text style={styles.statValue}>{formatTime(leftDuration)}</Text>
            <Text style={styles.statLabel}>Miktar</Text>
            <Text style={styles.statValue}>{leftAmount} ml</Text>
          </View>
        </View>

        {/* Sağ Göğüs */}
        <View style={styles.breastContainer}>
          <TouchableOpacity
            style={[
              styles.breast,
              styles.rightBreast,
              activeSide === 'right' && styles.activeBreast,
              activeSide === 'left' && styles.inactiveBreast,
            ]}
            onPress={() => activeSide === 'right' ? stopFeeding() : startFeeding('right')}
            disabled={activeSide === 'left'}
          >
            <Animated.View style={[styles.breastInner, { transform: [{ scale: rightBreastAnim }] }]}>
              <View style={styles.breastContent}>
                <Ionicons name="water" size={40} color="#FF6B9D" />
                <Text style={styles.breastLabel}>Sağ</Text>
                <Text style={styles.breastSublabel}>Kırmızı Kapak</Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
          
          <MilkFlow side="right" />
          
          <View style={styles.breastStats}>
            <Text style={styles.statLabel}>Süre</Text>
            <Text style={styles.statValue}>{formatTime(rightDuration)}</Text>
            <Text style={styles.statLabel}>Miktar</Text>
            <Text style={styles.statValue}>{rightAmount} ml</Text>
          </View>
        </View>
      </View>

      {/* Mide Animasyonu */}
      <View style={styles.stomachContainer}>
        <View style={styles.stomachOutline}>
          <Text style={styles.stomachLabel}>Mide</Text>
          <Animated.View
            style={[
              styles.stomachFill,
              {
                height: stomachFillAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 120],
                }),
              },
            ]}
          />
          <View style={styles.stomachStats}>
            <Text style={styles.totalStat}>Toplam: {totalAmount} ml</Text>
            <Text style={styles.totalStat}>Süre: {formatTime(totalDuration)}</Text>
          </View>
        </View>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlArea}>
        <TouchableOpacity
          style={[styles.controlButton, styles.bottleButton]}
          onPress={() => {
            // TODO: Bottle feeding modal
            Alert.alert('Bilgi', 'Biberon besleme özelliği yakında eklenecek.');
          }}
        >
          <Ionicons name="restaurant" size={24} color="white" />
          <Text style={styles.controlButtonText}>Biberon</Text>
        </TouchableOpacity>
        
        {isFeeding && (
          <TouchableOpacity
            style={[styles.controlButton, styles.stopButton]}
            onPress={stopFeeding}
          >
            <Ionicons name="stop" size={24} color="white" />
            <Text style={styles.controlButtonText}>Bitir</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
    backgroundColor: '#FF6B9D',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  babyInfo: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  babyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  sessionInfo: {
    fontSize: 14,
    color: '#718096',
    marginTop: 5,
  },
  feedingArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 30,
  },
  breastContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  breast: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  leftBreast: {
    backgroundColor: '#4299E1',
  },
  rightBreast: {
    backgroundColor: '#FF6B9D',
  },
  activeBreast: {
    shadowColor: '#FF6B9D',
    shadowOpacity: 0.4,
    elevation: 12,
  },
  inactiveBreast: {
    opacity: 0.5,
  },
  breastInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  breastContent: {
    alignItems: 'center',
  },
  breastLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginTop: 5,
  },
  breastSublabel: {
    fontSize: 12,
    color: '#718096',
  },
  milkFlowContainer: {
    position: 'absolute',
    top: 120,
    width: 60,
    height: 150,
    alignItems: 'center',
  },
  leftFlow: {
    left: 30,
  },
  rightFlow: {
    right: 30,
  },
  milkDrop: {
    position: 'absolute',
    top: 0,
  },
  milkDropInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  milkStream: {
    width: 2,
    height: 100,
    backgroundColor: '#E2E8F0',
    position: 'absolute',
    top: 10,
  },
  breastStats: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginTop: 2,
  },
  stomachContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  stomachOutline: {
    width: 150,
    height: 150,
    borderWidth: 3,
    borderColor: '#48BB78',
    borderRadius: 75,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  stomachLabel: {
    position: 'absolute',
    top: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#48BB78',
  },
  stomachFill: {
    width: '100%',
    backgroundColor: '#48BB78',
    borderRadius: 72,
    position: 'absolute',
    bottom: 0,
  },
  stomachStats: {
    position: 'absolute',
    bottom: 10,
    alignItems: 'center',
  },
  totalStat: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  controlArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    marginTop: 40,
    paddingBottom: 40,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    justifyContent: 'center',
  },
  bottleButton: {
    backgroundColor: '#667eea',
  },
  stopButton: {
    backgroundColor: '#DC3545',
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
});

export default FeedingScreen;