import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
  EnhancedLineChart,
  ProgressRing,
  ActivityHeatmap,
  ComparisonBarChart,
  GrowthChart,
  StatsCard,
} from '../components/charts/ChartComponents';

const { width } = Dimensions.get('window');

const StatisticsScreenEnhanced = () => {
  const { activities, baby } = useSelector((state: RootState) => state.activities);
  const [selectedPeriod, setSelectedPeriod] = useState<'7' | '30' | '90'>('7');
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'sleep' | 'feeding' | 'diaper'>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Calculate comprehensive statistics
  const calculateStats = useMemo(() => {
    const now = new Date();
    const periodDays = parseInt(selectedPeriod);
    const startDate = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000));

    const filteredActivities = activities.filter(activity => {
      const activityDate = new Date(activity.startTime);
      return activityDate >= startDate && activityDate <= now;
    });

    // Daily statistics
    const dailyStats = [];
    for (let i = 0; i < periodDays; i++) {
      const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
      const dateStr = date.toDateString();
      
      const dayActivities = filteredActivities.filter(activity => {
        const activityDate = new Date(activity.startTime).toDateString();
        return activityDate === dateStr;
      });

      const sleepTime = dayActivities
        .filter(a => a.type === 'sleep')
        .reduce((total, a) => {
          if (a.endTime) {
            return total + (new Date(a.endTime).getTime() - new Date(a.startTime).getTime());
          }
          return total;
        }, 0);

      const feedingAmount = dayActivities
        .filter(a => a.type === 'feeding')
        .reduce((total, a) => total + (a.quantity || 0), 0);

      const diaperCount = dayActivities.filter(a => a.type === 'diaper').length;

      dailyStats.push({
        date: date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }),
        sleep: Math.round(sleepTime / (1000 * 60)), // in minutes
        feeding: feedingAmount,
        diaper: diaperCount,
      });
    }

    // Weekly heatmap data (last 12 weeks)
    const heatmapData = [];
    for (let week = 0; week < 12; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(now.getTime() - ((week * 7 + day) * 24 * 60 * 60 * 1000));
        const dateStr = date.toDateString();
        
        const dayActivities = activities.filter(activity => {
          const activityDate = new Date(activity.startTime).toDateString();
          return activityDate === dateStr;
        });
        
        weekData.push(dayActivities.length);
      }
      heatmapData.push(weekData.reverse());
    }
    heatmapData.reverse();

    // Calculate totals and averages
    const totals = {
      sleep: dailyStats.reduce((total, day) => total + day.sleep, 0),
      feeding: dailyStats.reduce((total, day) => total + day.feeding, 0),
      diaper: dailyStats.reduce((total, day) => total + day.diaper, 0),
    };

    const averages = {
      sleep: Math.round(totals.sleep / periodDays),
      feeding: Math.round(totals.feeding / periodDays),
      diaper: Math.round(totals.diaper / periodDays),
    };

    // Calculate trends (compare with previous period)
    const previousPeriodDays = periodDays;
    const previousStartDate = new Date(startDate.getTime() - (previousPeriodDays * 24 * 60 * 60 * 1000));
    
    const previousActivities = activities.filter(activity => {
      const activityDate = new Date(activity.startTime);
      return activityDate >= previousStartDate && activityDate < startDate;
    });

    const previousAverages = {
      sleep: previousActivities
        .filter(a => a.type === 'sleep')
        .reduce((total, a) => {
          if (a.endTime) {
            return total + (new Date(a.endTime).getTime() - new Date(a.startTime).getTime());
          }
          return total;
        }, 0) / (1000 * 60) / previousPeriodDays,
      feeding: previousActivities
        .filter(a => a.type === 'feeding')
        .reduce((total, a) => total + (a.quantity || 0), 0) / previousPeriodDays,
      diaper: previousActivities
        .filter(a => a.type === 'diaper').length / previousPeriodDays,
    };

    const trends = {
      sleep: ((averages.sleep - previousAverages.sleep) / previousAverages.sleep) * 100,
      feeding: ((averages.feeding - previousAverages.feeding) / (previousAverages.feeding || 1)) * 100,
      diaper: ((averages.diaper - previousAverages.diaper) / (previousAverages.diaper || 1)) * 100,
    };

    return {
      dailyStats,
      heatmapData,
      totals,
      averages,
      trends,
    };
  }, [activities, selectedPeriod]);

  // Prepare chart data
  const getChartData = useMemo(() => {
    const labels = calculateStats.dailyStats.map(day => day.date);
    let datasets: any[] = [];

    if (selectedMetric === 'all' || selectedMetric === 'sleep') {
      datasets.push({
        data: calculateStats.dailyStats.map(day => day.sleep),
        color: (opacity = 1) => `rgba(159, 122, 234, ${opacity})`,
        strokeWidth: 2,
      });
    }

    if (selectedMetric === 'all' || selectedMetric === 'feeding') {
      datasets.push({
        data: calculateStats.dailyStats.map(day => day.feeding),
        color: (opacity = 1) => `rgba(255, 107, 157, ${opacity})`,
        strokeWidth: 2,
      });
    }

    if (selectedMetric === 'all' || selectedMetric === 'diaper') {
      datasets.push({
        data: calculateStats.dailyStats.map(day => day.diaper),
        color: (opacity = 1) => `rgba(72, 187, 120, ${opacity})`,
        strokeWidth: 2,
      });
    }

    return { labels, datasets };
  }, [calculateStats.dailyStats, selectedMetric]);

  // Format time helper
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Calculate daily goals
  const calculateGoals = () => {
    // Recommended daily values for a baby
    const recommendedSleep = 720; // 12 hours in minutes
    const recommendedFeeding = 800; // ml
    const recommendedDiapers = 6;

    return {
      sleep: Math.min(100, Math.round((calculateStats.averages.sleep / recommendedSleep) * 100)),
      feeding: Math.min(100, Math.round((calculateStats.averages.feeding / recommendedFeeding) * 100)),
      diaper: Math.min(100, Math.round((calculateStats.averages.diaper / recommendedDiapers) * 100)),
    };
  };

  const goals = calculateGoals();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>İstatistikler</Text>
          <Text style={styles.headerSubtitle}>{baby?.name || 'Bebek'} - Son {selectedPeriod} gün</Text>
        </View>
        <TouchableOpacity style={styles.exportButton}>
          <Ionicons name="download" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStatsContainer}>
        <StatsCard
          title="Ortalama Uyku"
          value={formatTime(calculateStats.averages.sleep)}
          icon="bed"
          color="#9F7AEA"
          trend={{
            value: Math.round(calculateStats.trends.sleep),
            isUp: calculateStats.trends.sleep >= 0,
          }}
        />
        <StatsCard
          title="Ortalama Beslenme"
          value={`${calculateStats.averages.feeding} ml`}
          icon="restaurant"
          color="#FF6B9D"
          trend={{
            value: Math.round(calculateStats.trends.feeding),
            isUp: calculateStats.trends.feeding >= 0,
          }}
        />
      </View>
      
      <View style={styles.quickStatsContainer}>
        <StatsCard
          title="Ortalama Bez"
          value={`${calculateStats.averages.diaper} adet`}
          icon="color-wash"
          color="#48BB78"
          trend={{
            value: Math.round(calculateStats.trends.diaper),
            isUp: calculateStats.trends.diaper >= 0,
          }}
        />
        <StatsCard
          title="Günlük Aktivite"
          value={Math.round(activities.length / parseInt(selectedPeriod))}
          subtitle="aktivite/gün"
          icon="stats-chart"
          color="#4299E1"
        />
      </View>

      {/* Progress Rings */}
      <View style={styles.progressRingsContainer}>
        <Text style={styles.sectionTitle}>Günlük Hedefler</Text>
        <View style={styles.ringsRow}>
          <ProgressRing
            size={100}
            progress={goals.sleep}
            title="Uyku"
            subtitle={`${formatTime(calculateStats.averages.sleep)}`}
            icon="bed"
            progressColor="#9F7AEA"
          />
          <ProgressRing
            size={100}
            progress={goals.feeding}
            title="Beslenme"
            subtitle={`${calculateStats.averages.feeding} ml`}
            icon="restaurant"
            progressColor="#FF6B9D"
          />
          <ProgressRing
            size={100}
            progress={goals.diaper}
            title="Bez"
            subtitle={`${calculateStats.averages.diaper} adet`}
            icon="color-wash"
            progressColor="#48BB78"
          />
        </View>
      </View>

      {/* Metric Selector */}
      <View style={styles.metricSelector}>
        {(['all', 'sleep', 'feeding', 'diaper'] as const).map((metric) => (
          <TouchableOpacity
            key={metric}
            style={[
              styles.metricButton,
              selectedMetric === metric && styles.activeMetricButton,
            ]}
            onPress={() => setSelectedMetric(metric)}
          >
            <Ionicons
              name={
                metric === 'all' ? 'stats-chart' :
                metric === 'sleep' ? 'bed' :
                metric === 'feeding' ? 'restaurant' : 'color-wash'
              }
              size={16}
              color={selectedMetric === metric ? 'white' : '#667eea'}
            />
            <Text
              style={[
                styles.metricText,
                selectedMetric === metric && styles.activeMetricText,
              ]}
            >
              {metric === 'all' ? 'Tümü' :
               metric === 'sleep' ? 'Uyku' :
               metric === 'feeding' ? 'Beslenme' : 'Bez'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Chart */}
      <EnhancedLineChart
        data={getChartData}
        title={
          selectedMetric === 'all' ? 'Tüm Aktiviteler' :
          selectedMetric === 'sleep' ? 'Uyku Süreleri' :
          selectedMetric === 'feeding' ? 'Beslenme Miktarları' : 'Bez Değişimleri'
        }
        height={240}
        onPeriodChange={setSelectedPeriod}
        selectedPeriod={selectedPeriod}
      />

      {/* Activity Heatmap */}
      <ActivityHeatmap
        data={calculateStats.heatmapData}
        title="Aktivite Haritası (Son 12 Hafta)"
        maxValue={Math.max(...calculateStats.heatmapData.flat())}
      />

      {/* Comparison Chart */}
      <ComparisonBarChart
        data={{
          labels: ['Uyku', 'Beslenme', 'Bez'],
          datasets: [{
            data: [
              calculateStats.averages.sleep,
              calculateStats.averages.feeding,
              calculateStats.averages.diaper,
            ],
            color: (opacity = 1) => `rgba(255, 107, 157, ${opacity})`,
          }],
        }}
        title="Kategori Karşılaştırması"
        height={180}
      />

      {/* Detailed Statistics */}
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Detaylı İstatistikler</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Toplam Uyku Süresi</Text>
          <Text style={styles.detailValue}>{formatTime(calculateStats.totals.sleep)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Toplam Beslenme</Text>
          <Text style={styles.detailValue}>{calculateStats.totals.feeding} ml</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Toplam Bez</Text>
          <Text style={styles.detailValue}>{calculateStats.totals.diaper} adet</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Kaydedilen Aktivite</Text>
          <Text style={styles.detailValue}>{activities.length} adet</Text>
        </View>
      </View>
    </ScrollView>
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
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickStatsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  progressRingsContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginBottom: 10,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 15,
  },
  ringsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metricSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  metricButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 5,
  },
  activeMetricButton: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  metricText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#667eea',
  },
  activeMetricText: {
    color: 'white',
  },
  detailsContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginBottom: 40,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
  },
  detailLabel: {
    fontSize: 14,
    color: '#4A5568',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
  },
});

export default StatisticsScreenEnhanced;