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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { AppHeader } from '../components/ui/AppHeader';

const { width } = Dimensions.get('window');

interface QuickAction {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  route: string;
  gradient: string[];
}

const HomeScreenNew = () => {
  const router = useRouter();
  const { colors, typography, spacing, borderRadius, shadows, isDark } = useThemedStyles();
  
  const currentBaby = useSelector((state: RootState) => state.database.currentBaby);
  const activities = useSelector((state: RootState) => state.activities.activities);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

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
      gradient: colors.gradients.primary,
    },
    { 
      id: 'sleep', 
      icon: 'moon', 
      label: 'Uyku', 
      color: colors.activity.sleep,
      route: '/(tabs)/sleep',
      gradient: colors.gradients.purple,
    },
    { 
      id: 'diaper', 
      icon: 'water', 
      label: 'Bez', 
      color: colors.activity.diaper,
      route: '/(tabs)/activities',
      gradient: colors.gradients.success,
    },
    { 
      id: 'health', 
      icon: 'medical', 
      label: 'Sağlık', 
      color: colors.activity.health,
      route: '/(tabs)/health',
      gradient: colors.gradients.sunset,
    },
  ], [colors]);

  const handleQuickAction = useCallback((route: string) => {
    router.push(route as any);
  }, [router]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric',
    });
  };

  const styles = createStyles(colors, typography, spacing, borderRadius, shadows, isDark);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <AppHeader title="Ana Sayfa" />
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
      {/* Header Section */}
      <LinearGradient
        colors={colors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.greeting}>
            {greeting} 👋
          </Text>
          {currentBaby && (
            <>
              <Text style={styles.babyName}>{currentBaby.name}</Text>
              <Text style={styles.babyAge}>{babyAge}</Text>
            </>
          )}
          <View style={styles.dateTimeContainer}>
            <Text style={styles.time}>{formatTime(currentTime)}</Text>
            <Text style={styles.date}>{formatDate(currentTime)}</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionCard}
              onPress={() => handleQuickAction(action.route)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={action.gradient as unknown as readonly [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickActionGradient}
              >
                <View style={styles.quickActionIcon}>
                  <Ionicons name={action.icon} size={28} color="white" />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Today's Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bugünün Özeti</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: colors.activity.sleep + '20' }]}>
                <Ionicons name="moon" size={24} color={colors.activity.sleep} />
              </View>
              <Text style={styles.summaryLabel}>Uyku</Text>
              <Text style={styles.summaryValue}>
                {todaySummary.sleepHours}s {todaySummary.sleepMinutes}d
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: colors.activity.feeding + '20' }]}>
                <Ionicons name="restaurant" size={24} color={colors.activity.feeding} />
              </View>
              <Text style={styles.summaryLabel}>Emzirme</Text>
              <Text style={styles.summaryValue}>{todaySummary.feedingCount} kez</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: colors.activity.diaper + '20' }]}>
                <Ionicons name="water" size={24} color={colors.activity.diaper} />
              </View>
              <Text style={styles.summaryLabel}>Bez</Text>
              <Text style={styles.summaryValue}>{todaySummary.diaperCount} kez</Text>
            </View>
          </View>
        </View>
      </View>

      {/* More Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daha Fazla</Text>
        <View style={styles.featuresList}>
          <TouchableOpacity 
            style={styles.featureItem}
            onPress={() => router.push('/(tabs)/statistics')}
          >
            <View style={[styles.featureIcon, { backgroundColor: colors.secondary[100] }]}>
              <Ionicons name="bar-chart" size={24} color={colors.secondary[600]} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>İstatistikler</Text>
              <Text style={styles.featureDescription}>Detaylı analizler ve grafikler</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureItem}
            onPress={() => router.push('/(tabs)/development')}
          >
            <View style={[styles.featureIcon, { backgroundColor: colors.success[100] }]}>
              <Ionicons name="trending-up" size={24} color={colors.success[600]} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Gelişim</Text>
              <Text style={styles.featureDescription}>Bebeğinizin gelişim takibi</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureItem}
            onPress={() => router.push('/(tabs)/calendar')}
          >
            <View style={[styles.featureIcon, { backgroundColor: colors.warning[100] }]}>
              <Ionicons name="calendar" size={24} color={colors.warning[600]} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Takvim & Planlayıcı</Text>
              <Text style={styles.featureDescription}>Randevular ve rutinler</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.neutral[400]} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: spacing['4xl'] }} />
    </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: any, typography: any, spacing: any, borderRadius: any, shadows: any, isDark: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: isDark ? colors.background.dark : colors.background.light,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: spacing['2xl'],
    paddingTop: spacing['6xl'],
    borderBottomLeftRadius: borderRadius['3xl'],
    borderBottomRightRadius: borderRadius['3xl'],
  },
  greeting: {
    ...typography.h2,
    color: 'white',
    marginBottom: spacing.sm,
  },
  babyName: {
    ...typography.h3,
    color: 'white',
    marginBottom: spacing.xs,
  },
  babyAge: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.lg,
  },
  dateTimeContainer: {
    marginTop: spacing.md,
  },
  time: {
    ...typography.h4,
    color: 'white',
  },
  date: {
    ...typography.bodySmall,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: spacing.xs,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing['2xl'],
  },
  sectionTitle: {
    ...typography.h4,
    color: isDark ? colors.text.primary : colors.neutral[900],
    marginBottom: spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickActionCard: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  quickActionGradient: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  quickActionIcon: {
    marginBottom: spacing.md,
  },
  quickActionLabel: {
    ...typography.labelLarge,
    color: 'white',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: isDark ? colors.background.cardDark : 'white',
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    ...typography.h5,
    color: isDark ? colors.text.primary : colors.neutral[900],
    fontWeight: '700',
  },
  summaryDivider: {
    width: 1,
    height: 60,
    backgroundColor: colors.neutral[200],
    marginHorizontal: spacing.sm,
  },
  featuresList: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? colors.background.cardDark : 'white',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    ...typography.labelLarge,
    color: isDark ? colors.text.primary : colors.neutral[900],
    marginBottom: spacing.xs,
  },
  featureDescription: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
});

export default React.memo(HomeScreenNew);
