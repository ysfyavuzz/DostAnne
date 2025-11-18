import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import GrowthChart from './GrowthChart';
import SleepChart from './SleepChart';
import ActivityChart from './ActivityChart';

interface DashboardChartsProps {
  babyName: string;
  babyAge: string;
  growthData: any[];
  sleepData: any[];
  activityData: any[];
  todayStats: {
    feedingCount: number;
    sleepDuration: number;
    diaperChanges: number;
    playTime: number;
  };
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  babyName,
  babyAge,
  growthData,
  sleepData,
  activityData,
  todayStats,
}) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Gelişim Grafikleri</Text>
        <Text style={styles.subtitle}>{babyName} • {babyAge}</Text>
      </View>

      {/* Today's Summary */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>📈 Bugünün Özeti</Text>
        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>🍼</Text>
            <Text style={styles.summaryValue}>{todayStats.feedingCount}</Text>
            <Text style={styles.summaryLabel}>Beslenme</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>😴</Text>
            <Text style={styles.summaryValue}>{Math.floor(todayStats.sleepDuration / 60)}s</Text>
            <Text style={styles.summaryLabel}>Uyku</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>👶</Text>
            <Text style={styles.summaryValue}>{todayStats.diaperChanges}</Text>
            <Text style={styles.summaryLabel}>Bez</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>🎮</Text>
            <Text style={styles.summaryValue}>{Math.floor(todayStats.playTime / 60)}s</Text>
            <Text style={styles.summaryLabel}>Oyun</Text>
          </View>
        </View>
      </View>

      {/* Growth Charts */}
      <View style={styles.chartSection}>
        <GrowthChart
          data={growthData}
          type="weight"
          babyName={babyName}
          currentAge={babyAge}
        />
      </View>

      <View style={styles.chartSection}>
        <GrowthChart
          data={growthData}
          type="height"
          babyName={babyName}
          currentAge={babyAge}
        />
      </View>

      {/* Sleep Chart */}
      <View style={styles.chartSection}>
        <SleepChart
          data={sleepData}
          type="daily"
          babyName={babyName}
        />
      </View>

      {/* Activity Chart */}
      <View style={styles.chartSection}>
        <ActivityChart
          data={activityData}
          type="summary"
          babyName={babyName}
          period="Son 7 Gün"
        />
      </View>

      {/* Quick Insights */}
      <View style={styles.insightsSection}>
        <Text style={styles.sectionTitle}>💡 Hızlı İçgörüler</Text>
        <View style={styles.insightCard}>
          <Text style={styles.insightText}>
            📊 {babyName} bugün {todayStats.feedingCount} kez beslendi. Bu {todayStats.feedingCount >= 6 ? 'sağlıklı' : 'düşük'} bir sayı.
          </Text>
        </View>
        <View style={styles.insightCard}>
          <Text style={styles.insightText}>
            😴 Bugünkü uyku süresi: {Math.floor(todayStats.sleepDuration / 60)} saat {todayStats.sleepDuration % 60} dakika
          </Text>
        </View>
        <View style={styles.insightCard}>
          <Text style={styles.insightText}>
            👶 {todayStats.diaperChanges} kez bez değiştirildi. Rutin takip ediliyor.
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 16,
  },
  summarySection: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#636E72',
    fontWeight: '500',
  },
  chartSection: {
    marginBottom: 8,
  },
  insightsSection: {
    padding: 20,
    backgroundColor: 'white',
    paddingBottom: 40,
  },
  insightCard: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#1565C0',
    lineHeight: 20,
  },
});

export default DashboardCharts;