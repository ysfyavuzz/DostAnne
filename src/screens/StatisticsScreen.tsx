import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { AppHeader } from '../components/ui/AppHeader';

const { width } = Dimensions.get('window');

const StatisticsScreenNew = () => {
  const { colors, typography, spacing, borderRadius, shadows, isDark } = useThemedStyles();
  
  const activities = useSelector((state: RootState) => state.activities.activities);
  const currentBaby = useSelector((state: RootState) => state.database.currentBaby);

  // Calculate statistics
  const stats = useMemo(() => {
    const last7Days = activities.filter(a => {
      const activityDate = new Date(a.startTime);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return activityDate >= weekAgo;
    });

    const feeding = last7Days.filter(a => a.type === 'feeding').length;
    const sleep = last7Days.filter(a => a.type === 'sleep').length;
    const diaper = last7Days.filter(a => a.type === 'diaper').length;
    const health = last7Days.filter(a => a.type === 'health').length;

    const avgPerDay = Math.round(last7Days.length / 7);

    return {
      total: activities.length,
      last7Days: last7Days.length,
      feeding,
      sleep,
      diaper,
      health,
      avgPerDay,
    };
  }, [activities]);

  const stylesObj = styles(colors, typography, spacing, borderRadius, shadows, isDark);

  return (
    <SafeAreaView style={stylesObj.safeArea} edges={['bottom']}>
      <AppHeader title="İstatistikler" />
      <ScrollView style={stylesObj.container}>
      {/* Header */}
      <View style={stylesObj.header}>
        <Text style={stylesObj.title}>İstatistikler</Text>
        <Text style={stylesObj.subtitle}>Son 7 günlük aktivite özeti</Text>
      </View>

      {/* Summary Cards */}
      <View style={stylesObj.section}>
        <View style={stylesObj.summaryGrid}>
          <View style={stylesObj.summaryCard}>
            <LinearGradient
              colors={colors.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={stylesObj.summaryGradient}
            >
              <Ionicons name="stats-chart" size={32} color="white" />
              <Text style={stylesObj.summaryValue}>{stats.total}</Text>
              <Text style={stylesObj.summaryLabel}>Toplam Aktivite</Text>
            </LinearGradient>
          </View>

          <View style={stylesObj.summaryCard}>
            <LinearGradient
              colors={colors.gradients.secondary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={stylesObj.summaryGradient}
            >
              <Ionicons name="calendar" size={32} color="white" />
              <Text style={stylesObj.summaryValue}>{stats.last7Days}</Text>
              <Text style={stylesObj.summaryLabel}>Son 7 Gün</Text>
            </LinearGradient>
          </View>
        </View>
      </View>

      {/* Activity Breakdown */}
      <View style={stylesObj.section}>
        <Text style={stylesObj.sectionTitle}>Aktivite Dağılımı</Text>
        
        <View style={stylesObj.activityList}>
          <View style={stylesObj.activityItem}>
            <View style={[stylesObj.activityIcon, { backgroundColor: colors.activity.feeding + '20' }]}>
              <Ionicons name="restaurant" size={24} color={colors.activity.feeding} />
            </View>
            <View style={stylesObj.activityContent}>
              <Text style={stylesObj.activityLabel}>Emzirme</Text>
              <Text style={stylesObj.activitySubtext}>Son 7 gün</Text>
            </View>
            <Text style={stylesObj.activityCount}>{stats.feeding}</Text>
          </View>

          <View style={stylesObj.activityItem}>
            <View style={[stylesObj.activityIcon, { backgroundColor: colors.activity.sleep + '20' }]}>
              <Ionicons name="moon" size={24} color={colors.activity.sleep} />
            </View>
            <View style={stylesObj.activityContent}>
              <Text style={stylesObj.activityLabel}>Uyku</Text>
              <Text style={stylesObj.activitySubtext}>Son 7 gün</Text>
            </View>
            <Text style={stylesObj.activityCount}>{stats.sleep}</Text>
          </View>

          <View style={stylesObj.activityItem}>
            <View style={[stylesObj.activityIcon, { backgroundColor: colors.activity.diaper + '20' }]}>
              <Ionicons name="water" size={24} color={colors.activity.diaper} />
            </View>
            <View style={stylesObj.activityContent}>
              <Text style={stylesObj.activityLabel}>Bez Değişimi</Text>
              <Text style={stylesObj.activitySubtext}>Son 7 gün</Text>
            </View>
            <Text style={stylesObj.activityCount}>{stats.diaper}</Text>
          </View>

          <View style={stylesObj.activityItem}>
            <View style={[stylesObj.activityIcon, { backgroundColor: colors.activity.health + '20' }]}>
              <Ionicons name="medical" size={24} color={colors.activity.health} />
            </View>
            <View style={stylesObj.activityContent}>
              <Text style={stylesObj.activityLabel}>Sağlık</Text>
              <Text style={stylesObj.activitySubtext}>Son 7 gün</Text>
            </View>
            <Text style={stylesObj.activityCount}>{stats.health}</Text>
          </View>
        </View>
      </View>

      {/* Average */}
      <View style={stylesObj.section}>
        <View style={stylesObj.averageCard}>
          <View style={stylesObj.averageIcon}>
            <Ionicons name="analytics" size={40} color={colors.primary[500]} />
          </View>
          <View style={stylesObj.averageContent}>
            <Text style={stylesObj.averageLabel}>Günlük Ortalama</Text>
            <Text style={stylesObj.averageValue}>{stats.avgPerDay} aktivite</Text>
            <Text style={stylesObj.averageSubtext}>
              Son 7 günde günde ortalama {stats.avgPerDay} aktivite kaydettiniz
            </Text>
          </View>
        </View>
      </View>

      {/* Info */}
      {stats.total === 0 && (
        <View style={stylesObj.emptyState}>
          <Ionicons name="bar-chart-outline" size={64} color={colors.neutral[300]} />
          <Text style={stylesObj.emptyTitle}>Henüz veri yok</Text>
          <Text style={stylesObj.emptyDescription}>
            Aktivite eklemeye başladıkça burada istatistikleri görebilirsiniz
          </Text>
        </View>
      )}

      <View style={{ height: spacing['4xl'] }} />
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = (colors: any, typography: any, spacing: any, borderRadius: any, shadows: any, isDark: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: isDark ? colors.background.dark : colors.background.light,
  },
  container: {
    flex: 1,
    backgroundColor: isDark ? colors.background.dark : colors.background.light,
  },
  header: {
    padding: spacing['2xl'],
    paddingTop: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing['2xl'],
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  summaryCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  summaryGradient: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  summaryValue: {
    ...typography.display,
    color: 'white',
    fontWeight: '800',
    marginVertical: spacing.sm,
  },
  summaryLabel: {
    ...typography.label,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  activityList: {
    backgroundColor: isDark ? colors.background.cardDark : 'white',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityLabel: {
    ...typography.labelLarge,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  activitySubtext: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  activityCount: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '700',
  },
  averageCard: {
    backgroundColor: isDark ? colors.background.cardDark : 'white',
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm,
  },
  averageIcon: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  averageContent: {
    flex: 1,
  },
  averageLabel: {
    ...typography.label,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  averageValue: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  averageSubtext: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
  },
  emptyState: {
    padding: spacing['4xl'],
    alignItems: 'center',
  },
  emptyTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default React.memo(StatisticsScreenNew);
