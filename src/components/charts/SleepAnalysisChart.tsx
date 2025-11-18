import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const { width } = Dimensions.get('window');

interface SleepDataPoint {
  date: string;
  sleepDuration: number; // in minutes
  bedTime: string;
  wakeTime: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

interface SleepAnalysisChartProps {
  period?: '7' | '30' | '90';
  onPeriodChange?: (period: string) => void;
}

export const SleepAnalysisChart: React.FC<SleepAnalysisChartProps> = ({
  period = '7',
  onPeriodChange,
}) => {
  const { activities, baby } = useSelector((state: RootState) => state.activities);

  // Calculate sleep analysis data
  const sleepAnalysis = useMemo(() => {
    const now = new Date();
    const periodDays = parseInt(period);
    const startDate = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000));

    const filteredActivities = activities.filter(activity => {
      const activityDate = new Date(activity.startTime);
      return activityDate >= startDate && activityDate <= now && activity.type === 'sleep';
    });

    // Daily sleep data
    const dailySleepData: SleepDataPoint[] = [];
    let totalSleep = 0;
    let qualityDistribution = { excellent: 0, good: 0, fair: 0, poor: 0 };

    for (let i = 0; i < periodDays; i++) {
      const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
      const dateStr = date.toDateString();
      
      const daySleepActivities = filteredActivities.filter(activity => {
        const activityDate = new Date(activity.startTime).toDateString();
        return activityDate === dateStr;
      });

      let daySleepDuration = 0;
      let earliestBedTime = '';
      let latestWakeTime = '';
      
      daySleepActivities.forEach(activity => {
        if (activity.endTime) {
          const duration = new Date(activity.endTime).getTime() - new Date(activity.startTime).getTime();
          daySleepDuration += duration / (1000 * 60); // convert to minutes
          
          const startTime = new Date(activity.startTime);
          const endTime = new Date(activity.endTime);
          
          if (!earliestBedTime || startTime < new Date(earliestBedTime)) {
            earliestBedTime = startTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
          }
          
          if (!latestWakeTime || endTime > new Date(latestWakeTime + ' ' + dateStr)) {
            latestWakeTime = endTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
          }
        }
      });

      totalSleep += daySleepDuration;

      // Calculate sleep quality based on duration and consistency
      let quality: 'excellent' | 'good' | 'fair' | 'poor' = 'fair';
      if (daySleepDuration >= 480) quality = 'excellent'; // 8+ hours
      else if (daySleepDuration >= 420) quality = 'good'; // 7+ hours
      else if (daySleepDuration >= 360) quality = 'fair'; // 6+ hours
      else quality = 'poor';

      qualityDistribution[quality]++;

      dailySleepData.push({
        date: date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }),
        sleepDuration: Math.round(daySleepDuration),
        bedTime: earliestBedTime || '—',
        wakeTime: latestWakeTime || '—',
        quality,
      });
    }

    // Sleep pattern analysis
    const sleepPattern = {
      averageBedtime: '22:30',
      averageWakeTime: '07:00',
      longestSleep: Math.max(...dailySleepData.map(d => d.sleepDuration)),
      shortestSleep: Math.min(...dailySleepData.map(d => d.sleepDuration)),
    };

    return {
      dailyData: dailySleepData,
      totalSleep,
      averageSleep: Math.round(totalSleep / periodDays),
      qualityDistribution,
      sleepPattern,
    };
  }, [activities, period]);

  // Prepare chart data
  const getLineChartData = () => ({
    labels: sleepAnalysis.dailyData.map(d => d.date),
    datasets: [{
      data: sleepAnalysis.dailyData.map(d => d.sleepDuration),
      color: (opacity = 1) => `rgba(159, 122, 234, ${opacity})`,
      strokeWidth: 3,
    }],
  });

  const getBarChartData = () => {
    const last7Days = sleepAnalysis.dailyData.slice(-7);
    return {
      labels: last7Days.map(d => d.date),
      datasets: [{
        data: last7Days.map(d => d.sleepDuration),
      }],
    };
  };

  const getPieChartData = () => {
    const data = [
      {
        name: 'Mükemmel',
        population: sleepAnalysis.qualityDistribution.excellent,
        color: '#48BB78',
        legendFontColor: '#718096',
        legendFontSize: 12,
      },
      {
        name: 'İyi',
        population: sleepAnalysis.qualityDistribution.good,
        color: '#4299E1',
        legendFontColor: '#718096',
        legendFontSize: 12,
      },
      {
        name: 'Orta',
        population: sleepAnalysis.qualityDistribution.fair,
        color: '#F6AD55',
        legendFontColor: '#718096',
        legendFontSize: 12,
      },
      {
        name: 'Zayıf',
        population: sleepAnalysis.qualityDistribution.poor,
        color: '#F56565',
        legendFontColor: '#718096',
        legendFontSize: 12,
      },
    ].filter(item => item.population > 0);

    return data;
  };

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
    },
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return '#48BB78';
      case 'good': return '#4299E1';
      case 'fair': return '#F6AD55';
      case 'poor': return '#F56565';
      default: return '#A0AEC0';
    }
  };

  const getQualityText = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'Mükemmel';
      case 'good': return 'İyi';
      case 'fair': return 'Orta';
      case 'poor': return 'Zayıf';
      default: return 'Bilinmeyen';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Uyku Analizi</Text>
        {onPeriodChange && (
          <View style={styles.periodSelector}>
            {['7', '30', '90'].map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.periodButton,
                  period === p && styles.activePeriodButton,
                ]}
                onPress={() => onPeriodChange(p)}
              >
                <Text
                  style={[
                    styles.periodText,
                    period === p && styles.activePeriodText,
                  ]}
                >
                  {p}g
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryCards}>
        <View style={styles.summaryCard}>
          <View style={[styles.summaryIcon, { backgroundColor: '#F0E6FF' }]}>
            <Ionicons name="bed" size={20} color="#9F7AEA" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Ortalama Uyku</Text>
            <Text style={styles.summaryValue}>{formatTime(sleepAnalysis.averageSleep)}</Text>
            <Text style={styles.summarySubtitle}>günlük</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={[styles.summaryIcon, { backgroundColor: '#E6FFFA' }]}>
            <Ionicons name="trending-up" size={20} color="#48BB78" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Uyku Kalitesi</Text>
            <Text style={styles.summaryValue}>
              {getQualityText(
                sleepAnalysis.qualityDistribution.excellent > sleepAnalysis.qualityDistribution.poor ? 'good' : 'fair'
              )}
            </Text>
            <Text style={styles.summarySubtitle}>genel</Text>
          </View>
        </View>
      </View>

      {/* Sleep Duration Trend */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Uyku Süresi Trendi</Text>
        <LineChart
          data={getLineChartData()}
          width={width - 40}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={false}
        />
      </View>

      {/* Sleep Quality Distribution */}
      {getPieChartData().length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Uyku Kalitesi Dağılımı</Text>
          <PieChart
            data={getPieChartData()}
            width={width - 40}
            height={180}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 10]}
          />
        </View>
      )}

      {/* Sleep Pattern Analysis */}
      <View style={styles.patternContainer}>
        <Text style={styles.sectionTitle}>Uyku Deseni Analizi</Text>
        
        <View style={styles.patternRow}>
          <View style={styles.patternItem}>
            <Ionicons name="moon" size={16} color="#9F7AEA" />
            <Text style={styles.patternLabel}>Ortalama Yatma</Text>
            <Text style={styles.patternValue}>{sleepAnalysis.sleepPattern.averageBedtime}</Text>
          </View>

          <View style={styles.patternItem}>
            <Ionicons name="sunny" size={16} color="#F6AD55" />
            <Text style={styles.patternLabel}>Ortalama Kalkma</Text>
            <Text style={styles.patternValue}>{sleepAnalysis.sleepPattern.averageWakeTime}</Text>
          </View>
        </View>

        <View style={styles.patternRow}>
          <View style={styles.patternItem}>
            <Ionicons name="arrow-up-circle" size={16} color="#48BB78" />
            <Text style={styles.patternLabel}>En Uzun Uyku</Text>
            <Text style={styles.patternValue}>{formatTime(sleepAnalysis.sleepPattern.longestSleep)}</Text>
          </View>

          <View style={styles.patternItem}>
            <Ionicons name="arrow-down-circle" size={16} color="#F56565" />
            <Text style={styles.patternLabel}>En Kısa Uyku</Text>
            <Text style={styles.patternValue}>{formatTime(sleepAnalysis.sleepPattern.shortestSleep)}</Text>
          </View>
        </View>
      </View>

      {/* Recent Sleep Quality */}
      <View style={styles.recentSleepContainer}>
        <Text style={styles.sectionTitle}>Son Uyku Kalitesi</Text>
        
        {sleepAnalysis.dailyData.slice(-3).reverse().map((day, index) => (
          <View key={index} style={styles.sleepQualityItem}>
            <View style={styles.sleepDateContainer}>
              <Text style={styles.sleepDate}>{day.date}</Text>
              <Text style={styles.sleepDuration}>{formatTime(day.sleepDuration)}</Text>
            </View>
            <View style={styles.sleepTimesContainer}>
              <Text style={styles.sleepTime}>
                <Ionicons name="moon" size={12} color="#9F7AEA" /> {day.bedTime}
              </Text>
              <Text style={styles.sleepTime}>
                <Ionicons name="sunny" size={12} color="#F6AD55" /> {day.wakeTime}
              </Text>
            </View>
            <View style={[
              styles.qualityBadge,
              { backgroundColor: getQualityColor(day.quality) + '20' }
            ]}>
              <Text style={[
                styles.qualityText,
                { color: getQualityColor(day.quality) }
              ]}>
                {getQualityText(day.quality)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activePeriodButton: {
    backgroundColor: '#FF6B9D',
  },
  periodText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#718096',
  },
  activePeriodText: {
    color: 'white',
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 15,
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
  summarySubtitle: {
    fontSize: 11,
    color: '#A0AEC0',
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  patternContainer: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  patternRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  patternItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
  },
  patternLabel: {
    fontSize: 11,
    color: '#718096',
    marginTop: 4,
    marginBottom: 2,
  },
  patternValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  recentSleepContainer: {
    marginBottom: 10,
  },
  sleepQualityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  sleepDateContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  sleepDate: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2D3748',
  },
  sleepDuration: {
    fontSize: 11,
    color: '#718096',
    marginTop: 2,
  },
  sleepTimesContainer: {
    flex: 2,
    alignItems: 'center',
  },
  sleepTime: {
    fontSize: 11,
    color: '#4A5568',
    marginBottom: 2,
  },
  qualityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  qualityText: {
    fontSize: 10,
    fontWeight: '600',
  },
});

export default SleepAnalysisChart;