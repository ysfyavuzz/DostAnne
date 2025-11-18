import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// One-Handed Mode optimizes UI for single-hand use while breastfeeding
// Key features:
// - Large touch targets (min 44pt as per Apple HIG)
// - Bottom-aligned controls (thumb reach zone)
// - Quick actions without scrolling
// - Minimal text input required
// - Haptic feedback for confirmation

interface OneHandedModeProps {
  onStartLeft: () => void;
  onStartRight: () => void;
  onStop: () => void;
  onPause: () => void;
  isActive: boolean;
  isPaused: boolean;
  currentSide: 'left' | 'right' | null;
  duration: number;
}

const OneHandedMode: React.FC<OneHandedModeProps> = ({
  onStartLeft,
  onStartRight,
  onStop,
  onPause,
  isActive,
  isPaused,
  currentSide,
  duration,
}) => {
  const [showQuickActions, setShowQuickActions] = useState(false);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleButtonPress = (action: () => void) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    action();
  };

  return (
    <View style={styles.container}>
      {/* Active Session Display - Top Area */}
      {isActive && (
        <View style={styles.activeSessionCard}>
          <View style={styles.activeSessionHeader}>
            <View style={styles.sideIndicator}>
              <Ionicons
                name={currentSide === 'left' ? 'chevron-back' : 'chevron-forward'}
                size={24}
                color="#FFFFFF"
              />
              <Text style={styles.sideText}>
                {currentSide === 'left' ? 'Sol Meme' : 'Sağ Meme'}
              </Text>
            </View>
            {isPaused && (
              <View style={styles.pausedBadge}>
                <Ionicons name="pause" size={16} color="#F59E0B" />
                <Text style={styles.pausedText}>Durakladı</Text>
              </View>
            )}
          </View>

          {/* Timer Display - Very Large and Visible */}
          <Text style={styles.timerDisplay}>{formatDuration(duration)}</Text>

          {/* Quick Info */}
          <View style={styles.quickInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={18} color="#6B7280" />
              <Text style={styles.infoText}>
                {isPaused ? 'Duraklatıldı' : 'Devam ediyor'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Bottom Control Panel - THUMB REACH ZONE */}
      <View style={styles.bottomPanel}>
        {!isActive ? (
          // Start Buttons - Side by Side for Quick Access
          <View style={styles.startButtonsContainer}>
            <TouchableOpacity
              style={[styles.largeButton, styles.leftButton]}
              onPress={() => handleButtonPress(onStartLeft)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="chevron-back" size={32} color="#FFFFFF" />
                <Text style={styles.buttonText}>Sol Meme</Text>
                <Text style={styles.buttonSubtext}>Başlat</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.largeButton, styles.rightButton]}
              onPress={() => handleButtonPress(onStartRight)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="chevron-forward" size={32} color="#FFFFFF" />
                <Text style={styles.buttonText}>Sağ Meme</Text>
                <Text style={styles.buttonSubtext}>Başlat</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          // Active Session Controls
          <View style={styles.activeControlsContainer}>
            {/* Main Actions Row */}
            <View style={styles.mainActionsRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.pauseButton]}
                onPress={() => handleButtonPress(onPause)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isPaused ? 'play' : 'pause'}
                  size={36}
                  color="#FFFFFF"
                />
                <Text style={styles.actionButtonText}>
                  {isPaused ? 'Devam' : 'Duraklat'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.stopButton]}
                onPress={() => handleButtonPress(onStop)}
                activeOpacity={0.8}
              >
                <Ionicons name="stop" size={36} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Bitir</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Switch Side Button */}
            <TouchableOpacity
              style={styles.switchSideButton}
              onPress={() => {
                handleButtonPress(() => {
                  onStop();
                  setTimeout(() => {
                    if (currentSide === 'left') {
                      onStartRight();
                    } else {
                      onStartLeft();
                    }
                  }, 100);
                });
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="swap-horizontal" size={24} color="#6366F1" />
              <Text style={styles.switchSideText}>Taraf Değiştir</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom Info Bar */}
        <View style={styles.infoBar}>
          <View style={styles.infoBarItem}>
            <Ionicons name="hand-left-outline" size={20} color="#9CA3AF" />
            <Text style={styles.infoBarText}>Tek El Modu</Text>
          </View>
          <View style={styles.infoBarDot} />
          <Text style={styles.infoBarText}>
            {isActive ? 'Aktif Seans' : 'Hazır'}
          </Text>
        </View>
      </View>

      {/* Helper Text - Only show when not active */}
      {!isActive && (
        <View style={styles.helperContainer}>
          <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
          <Text style={styles.helperText}>
            Tek elle kolayca kullanabilirsiniz. Büyük butonlar baş parmak erişim
            bölgesinde.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  activeSessionCard: {
    backgroundColor: '#1F2937',
    margin: 20,
    marginTop: 40,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  activeSessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sideIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  sideText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pausedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  pausedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59E0B',
  },
  timerDisplay: {
    fontSize: 72,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  },
  quickInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  bottomPanel: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
  },
  startButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  largeButton: {
    flex: 1,
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  leftButton: {},
  rightButton: {},
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  buttonSubtext: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  activeControlsContainer: {
    gap: 16,
  },
  mainActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 100,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  pauseButton: {
    backgroundColor: '#F59E0B',
  },
  stopButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  switchSideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#C7D2FE',
  },
  switchSideText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366F1',
  },
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    gap: 8,
  },
  infoBarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoBarDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
  infoBarText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  helperText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});

export default OneHandedMode;
