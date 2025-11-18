import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const { width } = Dimensions.get('window');

const StatisticsScreen = () => {
  const { activities, baby } = useSelector((state: RootState) => state.activities);
  const [selectedPeriod, setSelectedPeriod] = React.useState<'7' | '30' | '90'>('7');
  const [selectedMetric, setSelectedMetric] = React.useState<'all' | 'sleep' | 'feeding' | 'diaper'>('all');

  // Calculate statistics based on selected period
  const calculateStats = () => {
    const now = new Date();
    const periodDays = parseInt(selectedPeriod);
    const startDate = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000));

    const filteredActivities = activities.filter(activity => {
      const activityDate = new Date(activity.startTime);
      return activityDate >= startDate && activityDate <= now;
    });

    // Calculate daily averages
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

    // Calculate totals and averages
    const totalSleep = dailyStats.reduce((total, day) => total + day.sleep, 0);
    const totalFeeding = dailyStats.reduce((total, day) => total + day.feeding, 0);
    const totalDiapers = dailyStats.reduce((total, day) => total + day.diaper, 0);

    return {
      dailyStats,
      totals: {
        sleep: totalSleep,
        feeding: totalFeeding,
        diaper: totalDiapers,
      },
      averages: {
        sleep: Math.round(totalSleep / periodDays),
        feeding: Math.round(totalFeeding / periodDays),
        diaper: Math.round(totalDiapers / periodDays),
      },
    };
  };

  const stats = calculateStats();

  // Prepare chart data
  const getChartData = () => {
    const labels = stats.dailyStats.map(day => day.date);
    let datasets: any[] = [];

    if (selectedMetric === 'all' || selectedMetric === 'sleep') {
      datasets.push({
        data: stats.dailyStats.map(day => day.sleep),
        color: (opacity = 1) => `rgba(159, 122, 234, ${opacity})`,
        strokeWidth: 2,
      });
    }

    if (selectedMetric === 'all' || selectedMetric === 'feeding') {
      datasets.push({
        data: stats.dailyStats.map(day => day.feeding),
        color: (opacity = 1) => `rgba(255, 107, 157, ${opacity})`,
        strokeWidth: 2,
      });
    }

    if (selectedMetric === 'all' || selectedMetric === 'diaper') {
      datasets.push({
        data: stats.dailyStats.map(day => day.diaper),
        color: (opacity = 1) => `rgba(72, 187, 120, ${opacity})`,
        strokeWidth: 2,
      });
    }

    return { labels, datasets };
  };

  const chartData = getChartData();

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(45, 55, 72, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(113, 128, 150, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#667eea',
    },
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>İstatistikler</Text>
        <TouchableOpacity style={styles.exportButton}>
          <Ionicons name="download" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {(['7', '30', '90'] as const).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.activePeriodButton,
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === period && styles.activePeriodText,
              ]}
            >
              Son {period} gün
            </Text>
          </TouchableOpacity>
        ))}
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

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <View style={[styles.summaryIcon, { backgroundColor: '#F0E6FF' }]}>
            <Ionicons name="bed" size={20} color="#9F7AEA" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Ortalama Uyku</Text>
            <Text style={styles.summaryValue}>{formatTime(stats.averages.sleep)}</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={[styles.summaryIcon, { backgroundColor: '#FFF0F5' }]}>
            <Ionicons name="restaurant" size={20} color="#FF6B9D" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Ortalama Beslenme</Text>
            <Text style={styles.summaryValue}>{stats.averages.feeding} ml</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={[styles.summaryIcon, { backgroundColor: '#E6FFFA' }]}>
            <Ionicons name="color-wash" size={20} color="#48BB78" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Ortalama Bez</Text>
            <Text style={styles.summaryValue}>{stats.averages.diaper} adet</Text>
          </View>
        </View>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>
          {selectedMetric === 'all' ? 'Tüm Aktiviteler' :
           selectedMetric === 'sleep' ? 'Uyku Süreleri' :
           selectedMetric === 'feeding' ? 'Beslenme Miktarları' : 'Bez Değişimleri'}
        </Text>
        
        {chartData.datasets.length > 0 ? (
          <LineChart
            data={{
              labels: chartData.labels,
              datasets: chartData.datasets,
            }}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Ionicons name="bar-chart" size={48} color="#CBD5E0" />
            <Text style={styles.noDataText}>Bu dönem için veri yok</Text>
          </View>
        )}
      </View>

      {/* Detailed Stats */}
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Detaylı İstatistikler</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Toplam Uyku Süresi</Text>
          <Text style={styles.detailValue}>{formatTime(stats.totals.sleep)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Toplam Beslenme</Text>
          <Text style={styles.detailValue}>{stats.totals.feeding} ml</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Toplam Bez</Text>
          <Text style={styles.detailValue}>{stats.totals.diaper} adet</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Günlük Aktivite</Text>
          <Text style={styles.detailValue}>
            {Math.round(activities.length / parseInt(selectedPeriod))} adet
          </Text>
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
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 20,
    marginBottom: 10,
    borderRadius: 10,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activePeriodButton: {
    backgroundColor: '#FF6B9D',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#718096',
  },
  activePeriodText: {
    color: 'white',
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
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#718096',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  chartContainer: {
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
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDataText: {
    fontSize: 14,
    color: '#718096',
    marginTop: 10,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 15,
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

export default StatisticsScreen;