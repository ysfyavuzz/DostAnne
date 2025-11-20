import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

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
  const { colors, shadows, spacing, borderRadius } = useThemedStyles();
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
    <View style={[styles.container, { backgroundColor: colors.background.light }]}>
      {isActive && (
        <View style={[styles.activeSessionCard, { backgroundColor: colors.card, ...shadows.lg }]}>
          <View style={styles.activeSessionHeader}>
            <View style={[styles.sideIndicator, { backgroundColor: colors.primary[500] }]}>
              <Ionicons
                name={currentSide === 'left' ? 'chevron-back' : 'chevron-forward'}
                size={24}
                color={colors.text.inverse}
              />
              <Text style={[styles.sideText, { color: colors.text.inverse }]}>
                {currentSide === 'left' ? 'Sol Meme' : 'Sağ Meme'}
              </Text>
            </View>
            {isPaused && (
              <View style={[styles.pausedBadge, { backgroundColor: colors.warning[100] }]}>
                <Ionicons name="pause" size={16} color={colors.warning[700]} />
                <Text style={[styles.pausedText, { color: colors.warning[700] }]}>Durakladı</Text>
              </View>
            )}
          </View>

          <Text style={[styles.timerDisplay, { color: colors.text.primary }]}>{formatDuration(duration)}</Text>

          <View style={styles.quickInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={18} color={colors.text.secondary} />
              <Text style={[styles.infoText, { color: colors.text.secondary }]}>
                {isPaused ? 'Duraklatıldı' : 'Devam ediyor'}
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={[styles.bottomPanel, { backgroundColor: colors.background.light }]}>
        {!isActive ? (
          <View style={styles.startButtonsContainer}>
            <TouchableOpacity
              style={[styles.largeButton, styles.leftButton]}
              onPress={() => handleButtonPress(onStartLeft)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={colors.gradients.primary}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="chevron-back" size={32} color={colors.text.inverse} />
                <Text style={[styles.buttonText, { color: colors.text.inverse }]}>Sol Meme</Text>
                <Text style={[styles.buttonSubtext, { color: colors.text.inverse }]}>Başlat</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.largeButton, styles.rightButton]}
              onPress={() => handleButtonPress(onStartRight)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={colors.gradients.secondary}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="chevron-forward" size={32} color={colors.text.inverse} />
                <Text style={[styles.buttonText, { color: colors.text.inverse }]}>Sağ Meme</Text>
                <Text style={[styles.buttonSubtext, { color: colors.text.inverse }]}>Başlat</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.activeControlsContainer}>
            <View style={styles.mainActionsRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.warning[500], ...shadows.md }]}
                onPress={() => handleButtonPress(onPause)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isPaused ? 'play' : 'pause'}
                  size={36}
                  color={colors.text.inverse}
                />
                <Text style={[styles.actionButtonText, { color: colors.text.inverse }]}>
                  {isPaused ? 'Devam' : 'Duraklat'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.error[500], ...shadows.md }]}
                onPress={() => handleButtonPress(onStop)}
                activeOpacity={0.8}
              >
                <Ionicons name="stop" size={36} color={colors.text.inverse} />
                <Text style={[styles.actionButtonText, { color: colors.text.inverse }]}>Bitir</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.switchSideButton, { backgroundColor: colors.background.soft, borderColor: colors.border }]}
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
              <Ionicons name="swap-horizontal" size={24} color={colors.primary[500]} />
              <Text style={[styles.switchSideText, { color: colors.primary[500] }]}>Taraf Değiştir</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoBar}>
          <View style={styles.infoBarItem}>
            <Ionicons name="hand-left-outline" size={20} color={colors.text.tertiary} />
            <Text style={[styles.infoBarText, { color: colors.text.secondary }]}>Tek El Modu</Text>
          </View>
          <View style={[styles.infoBarDot, { backgroundColor: colors.text.tertiary }]} />
          <Text style={[styles.infoBarText, { color: colors.text.secondary }]}>
            {isActive ? 'Aktif Seans' : 'Hazır'}
          </Text>
        </View>
      </View>

      {!isActive && (
        <View style={[styles.helperContainer, { backgroundColor: colors.background.soft }]}>
          <Ionicons name="information-circle-outline" size={20} color={colors.text.secondary} />
          <Text style={[styles.helperText, { color: colors.text.secondary }]}>
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
    margin: 20,
    marginTop: 40,
    borderRadius: 24,
    padding: 24,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  sideText: {
    fontSize: 16,
    fontWeight: '700',
  },
  pausedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  pausedText: {
    fontSize: 12,
    fontWeight: '700',
  },
  timerDisplay: {
    fontSize: 72,
    fontWeight: '900',
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
    fontWeight: '600',
  },
  bottomPanel: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
  },
  buttonSubtext: {
    fontSize: 14,
    fontWeight: '600',
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
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '800',
  },
  switchSideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
  },
  switchSideText: {
    fontSize: 16,
    fontWeight: '700',
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
  },
  infoBarText: {
    fontSize: 13,
    fontWeight: '600',
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  helperText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});

export default OneHandedMode;
