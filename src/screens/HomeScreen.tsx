import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Animated,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { GlassView } from '../components/ui/GlassView';
import { ThemedButton } from '../components/ui/ThemedButton';

const { width } = Dimensions.get('window');

interface QuickAction {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  route: string;
  gradient: string[];
}

const HomeScreen = () => {
  const router = useRouter();
  const { colors, typography, spacing, borderRadius, shadows, isDark } = useThemedStyles();

  const currentBaby = useSelector((state: RootState) => state.database.currentBaby);
  const activities = useSelector((state: RootState) => state.activities.activities);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scrollY] = useState(new Animated.Value(0));

  // Update time every minute
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Greeting based on time
  const greeting = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Günaydın';
    if (hour < 18) return 'İyi Günler';
    return 'İyi Akşamlar';
  }, [currentTime]);

  // Dynamic Background Gradient
  const backgroundGradient = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour < 6 || hour > 20) return colors.gradients.ocean; // Night
    if (hour < 10) return colors.gradients.aurora; // Morning
    if (hour < 17) return colors.gradients.primary; // Day
    return colors.gradients.sunset; // Evening
  }, [currentTime, colors]);

  // Calculate baby age
  const babyAge = useMemo(() => {
    if (!currentBaby) return '';
    const birthDate = new Date(currentBaby.birthDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return `${diffDays} günlük`;
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    return `${months} ay ${days} günlük`;
  }, [currentBaby]);

  // Today's summary
  const todaySummary = useMemo(() => {
    const today = new Date().toDateString();
    const todayActivities = activities.filter(
      activity => new Date(activity.startTime).toDateString() === today
    );

    const sleepTime = todayActivities
      .filter(a => a.type === 'sleep')
      .reduce((total, a) => {
        if (a.endTime) {
          return total + (new Date(a.endTime).getTime() - new Date(a.startTime).getTime());
        }
        return total;
      }, 0);

    const feedingCount = todayActivities.filter(a => a.type === 'feeding').length;
    const diaperCount = todayActivities.filter(a => a.type === 'diaper').length;

    return {
      sleepHours: Math.floor(sleepTime / (1000 * 60 * 60)),
      sleepMinutes: Math.floor((sleepTime % (1000 * 60 * 60)) / (1000 * 60)),
      feedingCount,
      diaperCount,
      totalActivities: todayActivities.length,
    };
  }, [activities]);

  // Quick actions with proper routing
  const quickActions: QuickAction[] = useMemo(() => [
    {
      id: 'feeding',
      icon: 'restaurant',
      label: 'Emzirme',
      color: colors.activity.feeding,
      route: '/(tabs)/feeding',
      gradient: colors.gradients.feeding,
    },
    {
      id: 'sleep',
      icon: 'moon',
      label: 'Uyku',
      color: colors.activity.sleep,
      route: '/(tabs)/sleep',
      gradient: colors.gradients.sleep,
    },
    {
      id: 'diaper',
      icon: 'water',
      label: 'Bez',
      color: colors.activity.diaper,
      route: '/(tabs)/activities',
      gradient: colors.gradients.diaper,
    },
    {
      id: 'health',
      icon: 'medical',
      label: 'Sağlık',
      color: colors.activity.health,
      route: '/(tabs)/health',
      gradient: colors.gradients.danger,
    },
  ], [colors]);

  const handleQuickAction = useCallback((route: string) => {
    router.push(route as any);
  }, [router]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const styles = createStyles(colors, typography, spacing, borderRadius, shadows, isDark);

  const renderHeader = () => (
    <Animated.View style={[styles.headerContainer, { opacity: fadeAnim }]}>
      <GlassView style={styles.headerGlass} intensity={20} borderless>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.greeting}>{greeting},</Text>
              <Text style={styles.parentName}>Sevgili Anne</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/(tabs)/profile')}>
            <LinearGradient
              colors={colors.gradients.primary as any}
              style={styles.profileGradient}
            >
              <Text style={styles.profileInitial}>A</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </GlassView>
    </Animated.View>
  );

  const renderBabyCard = () => (
    <View style={styles.babyCardContainer}>
      <LinearGradient
        colors={backgroundGradient as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.babyCardGradient}
      >
        <View style={styles.babyInfo}>
          <View>
            <Text style={styles.babyName}>{currentBaby?.name || 'Bebeğim'}</Text>
            <Text style={styles.babyAge}>{babyAge}</Text>
          </View>
          <View style={styles.babyIconContainer}>
            <Ionicons name="happy" size={32} color="white" />
          </View>
        </View>

        {/* Gamification Widget: Level Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.levelText}>Seviye 3: Keşifçi</Text>
            <Text style={styles.xpText}>340/500 XP</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '68%' }]} />
          </View>
          <Text style={styles.nextMilestone}>Sonraki: İlk Gülümseme 🌟</Text>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Background Decor */}
      <LinearGradient
        colors={[colors.background.soft, colors.background.light] as any}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {renderHeader()}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary[500]} />
          }
        >
          {renderBabyCard()}

          {/* Quick Actions Grid */}
          <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={() => handleQuickAction(action.route)}
                activeOpacity={0.7}
              >
                <GlassView style={styles.quickActionGlass} intensity={40}>
                  <LinearGradient
                    colors={action.gradient as any}
                    style={styles.iconCircle}
                  >
                    <Ionicons name={action.icon} size={24} color="white" />
                  </LinearGradient>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </GlassView>
              </TouchableOpacity>
            ))}
          </View>

          {/* Today's Summary */}
          <Text style={styles.sectionTitle}>Bugünün Özeti</Text>
          <GlassView style={styles.summaryCard} intensity={30}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.activity.sleep }]}>
                  {todaySummary.sleepHours}s {todaySummary.sleepMinutes}d
                </Text>
                <Text style={styles.summaryLabel}>Uyku</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.activity.feeding }]}>
                  {todaySummary.feedingCount}
                </Text>
                <Text style={styles.summaryLabel}>Emzirme</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.activity.diaper }]}>
                  {todaySummary.diaperCount}
                </Text>
                <Text style={styles.summaryLabel}>Bez</Text>
              </View>
            </View>
          </GlassView>

          {/* Daily Tip */}
          <Text style={styles.sectionTitle}>Günün İpucu 💡</Text>
          <GlassView style={styles.tipCard} intensity={30}>
            <LinearGradient
              colors={colors.gradients.dream as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.tipBorder}
            />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Uyku Rutini</Text>
              <Text style={styles.tipText}>
                Bebeğinizi her gün aynı saatte yatırmak, biyolojik saatini düzenlemeye yardımcı olur. Ilık bir banyo harika bir başlangıçtır!
              </Text>
            </View>
          </GlassView>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const createStyles = (colors: any, typography: any, spacing: any, borderRadius: any, shadows: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  decorCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.primary[100],
    opacity: 0.5,
  },
  decorCircle2: {
    position: 'absolute',
    top: 200,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: colors.secondary[100],
    opacity: 0.4,
  },
  headerContainer: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerGlass: {
    borderRadius: borderRadius['2xl'],
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logoImage: {
    width: 48,
    height: 48,
  },
  greeting: {
    ...typography.body,
    color: colors.text.secondary,
  },
  parentName: {
    ...typography.h3,
    color: colors.text.primary,
  },
  profileButton: {
    ...shadows.sm,
  },
  profileGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    ...typography.h4,
    color: 'white',
  },
  babyCardContainer: {
    marginBottom: spacing['2xl'],
    ...shadows.lg,
  },
  babyCardGradient: {
    borderRadius: borderRadius['3xl'],
    padding: spacing.xl,
  },
  babyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  babyName: {
    ...typography.h2,
    color: 'white',
    marginBottom: spacing.xs,
  },
  babyAge: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  babyIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  levelText: {
    ...typography.caption,
    color: 'white',
    fontWeight: '700',
  },
  xpText: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginBottom: spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 3,
  },
  nextMilestone: {
    ...typography.captionSmall,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  quickActionCard: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
    height: 110,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  quickActionGlass: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.xl,
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    ...shadows.md,
  },
  quickActionLabel: {
    ...typography.label,
    color: colors.text.primary,
    fontWeight: '600',
  },
  summaryCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing['2xl'],
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    ...typography.h4,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.neutral[200],
  },
  tipCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
  },
  tipBorder: {
    height: 4,
    width: '100%',
  },
  tipContent: {
    padding: spacing.lg,
  },
  tipTitle: {
    ...typography.h5,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  tipText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});

export default React.memo(HomeScreen);
