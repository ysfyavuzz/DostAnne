import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  BarChart,
  LineChart,
  PieChart,
} from 'react-native-chart-kit';

interface SleepDataPoint {
  date: string;
  duration: number; // in minutes
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  startTime: string;
  endTime?: string;
  nightAwake: number; // in minutes
}

interface SleepChartProps {
  data: SleepDataPoint[];
  type: 'daily' | 'weekly' | 'quality' | 'pattern';
  babyName: string;
}

const SleepChart: React.FC<SleepChartProps> = ({ 
  data, 
  type, 
  babyName 
}) => {
  const screenWidth = Dimensions.get('window').width - 40;
  const chartHeight = 200;

  const getDailyChartData = () => {
    const labels = data.map(d => d.date.split(' ')[0]); // Just date part
    const durations = data.map(d => Math.round(d.duration / 60 * 10) / 10); // Convert to hours with 1 decimal
    const targetSleep = data.map(() => 14); // Target 14 hours for baby

    return {
      labels,
      datasets: [
        {
          data: durations,
          color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
        },
        {
          data: targetSleep,
          color: (opacity = 1) => `rgba(255, 99, 132, ${opacity * 0.5})`,
        },
      ],
      legends: ['Gerçek Uyku', 'Hedef Uyku'],
    };
  };

  const getQualityChartData = () => {
    const qualityCounts = data.reduce((acc, d) => {
      acc[d.quality] = (acc[d.quality] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pieData = [
      {
        name: 'Mükemmel',
        population: qualityCounts.excellent || 0,
        color: '#34C759',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: 'İyi',
        population: qualityCounts.good || 0,
        color: '#007AFF',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: 'Orta',
        population: qualityCounts.fair || 0,
        color: '#FF9500',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: 'Zayıf',
        population: qualityCounts.poor || 0,
        color: '#FF3B30',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
    ];

    return pieData;
  };

  const getPatternChartData = () => {
    const labels = data.map(d => d.date.split(' ')[0]);
    const daySleep = data.map(d => {
      const startHour = parseInt(d.startTime.split(':')[0]);
      // Count daytime sleep (6 AM - 8 PM)
      return startHour >= 6 && startHour < 20 ? Math.round(d.duration / 60 * 10) / 10 : 0;
    });
    const nightSleep = data.map(d => {
      const startHour = parseInt(d.startTime.split(':')[0]);
      // Count nighttime sleep (8 PM - 6 AM)
      return startHour >= 20 || startHour < 6 ? Math.round(d.duration / 60 * 10) / 10 : 0;
    });

    return {
      labels,
      datasets: [
        {
          data: daySleep,
          color: (opacity = 1) => `rgba(255, 206, 86, ${opacity})`,
        },
        {
          data: nightSleep,
          color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
        },
      ],
      legends: ['Gündüz Uykusu', 'Gece Uykusu'],
    };
  };

  const getChartData = () => {
    switch (type) {
      case 'daily':
        return getDailyChartData();
      case 'quality':
        return { data: getQualityChartData() };
      case 'pattern':
        return getPatternChartData();
      default:
        return getDailyChartData();
    }
  };

  const chartData = getChartData();
  const totalSleep = data.reduce((sum, d) => sum + d.duration, 0);
  const avgSleep = totalSleep / data.length / 60; // Convert to hours

  const getAverageQuality = () => {
    const qualityScores = {
      excellent: 4,
      good: 3,
      fair: 2,
      poor: 1,
    };
    
    const totalScore = data.reduce((sum, d) => sum + qualityScores[d.quality], 0);
    const avgScore = totalScore / data.length;
    
    if (avgScore >= 3.5) return { text: 'Mükemmel', color: '#34C759' };
    if (avgScore >= 2.5) return { text: 'İyi', color: '#007AFF' };
    if (avgScore >= 1.5) return { text: 'Orta', color: '#FF9500' };
    return { text: 'Geliştirilebilir', color: '#FF3B30' };
  };

  const avgQuality = getAverageQuality();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {type === 'daily' ? 'Günlük Uyku Süresi' :
           type === 'quality' ? 'Uyku Kalitesi Dağılımı' :
           'Uyku Deseni Analizi'}
        </Text>
        <Text style={styles.subtitle}>{babyName}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Ortalama Uyku</Text>
          <Text style={styles.statValue}>{avgSleep.toFixed(1)} saat</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Genel Kalite</Text>
          <View style={styles.qualityContainer}>
            <Text style={[
              styles.statValue, 
              { color: avgQuality.color }
            ]}>
              {avgQuality.text}
            </Text>
          </View>
        </View>
      </View>

      {type === 'quality' ? (
        <View style={styles.pieChartContainer}>
          <PieChart
            data={chartData.data}
            width={screenWidth}
            height={chartHeight}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={styles.chart}
          />
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chartContainer}>
            {type === 'daily' || type === 'pattern' ? (
              <BarChart
                data={chartData}
                width={Math.max(screenWidth, data.length * 70)}
                height={chartHeight}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForLabels: {
                    fontSize: 10,
                    fontWeight: '500',
                  },
                }}
                style={styles.chart}
              />
            ) : (
              <LineChart
                data={'labels' in chartData ? chartData : { labels: [], datasets: [] }}
                width={Math.max(screenWidth, data.length * 70)}
                height={chartHeight}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '4',
                    strokeWidth: '2',
                    stroke: '#ffffff',
                  },
                }}
                bezier
                style={styles.chart}
              />
            )}
          </View>
        </ScrollView>
      )}

      {type !== 'quality' && 'legends' in chartData && chartData.legends && (
        <View style={styles.legendContainer}>
          {chartData.legends.map((legend: string, index: number) => (
            <View key={index} style={styles.legendItem}>
              <View style={[
                styles.legendColor,
                { backgroundColor: 'datasets' in chartData && chartData.datasets[index]?.color(1) || '#007AFF' }
              ]} />
              <Text style={styles.legendText}>{legend}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.insightContainer}>
        <Text style={styles.insightTitle}>😴 Uyku İçgörüsü</Text>
        <Text style={styles.insightText}>
          {avgSleep >= 14 
            ? `${babyName} yenidoğan için ideal uyku süresini (14-17 saat) alıyor. Bu harika bir gelişim!`
            : avgSleep >= 12
            ? `${babyName} uyku süresi kabul edilebilir aralıkta, ancak yenidoğan için daha fazla uyku ideal.`
            : `${babyName} uyku süresi yenidoğan için önerilenin altında. Daha fazla uyku teşvik edin.`
          }
        </Text>
        <Text style={styles.tipText}>
          💡 İpucu: {avgQuality.text} uyku kalitesi için tutarlı bir uyku rutini oluşturun.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#636E72',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#636E72',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  qualityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pieChartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#636E72',
  },
  insightContainer: {
    backgroundColor: '#F0F8FF',
    padding: 12,
    borderRadius: 12,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 13,
    color: '#1565C0',
    lineHeight: 18,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#0D47A1',
    fontStyle: 'italic',
    lineHeight: 16,
  },
});

export default SleepChart;