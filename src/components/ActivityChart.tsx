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
  PieChart,
  LineChart,
} from 'react-native-chart-kit';

interface ActivityDataPoint {
  date: string;
  feeding: number;
  sleeping: number;
  diaper: number;
  playing: number;
  medical: number;
  totalActivities: number;
}

interface ActivityChartProps {
  data: ActivityDataPoint[];
  type: 'summary' | 'daily' | 'distribution' | 'trends';
  babyName: string;
  period: string;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ 
  data, 
  type, 
  babyName,
  period 
}) => {
  const screenWidth = Dimensions.get('window').width - 40;
  const chartHeight = 200;

  const getSummaryData = () => {
    const last7Days = data.slice(-7);
    const totalByType = last7Days.reduce((acc, d) => {
      acc.feeding += d.feeding;
      acc.sleeping += d.sleeping;
      acc.diaper += d.diaper;
      acc.playing += d.playing;
      acc.medical += d.medical;
      return acc;
    }, {
      feeding: 0,
      sleeping: 0,
      diaper: 0,
      playing: 0,
      medical: 0,
    });

    const pieData = [
      {
        name: 'Beslenme',
        population: totalByType.feeding,
        color: '#FF9500',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: 'Uyku',
        population: totalByType.sleeping,
        color: '#5AC8FA',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: 'Bez',
        population: totalByType.diaper,
        color: '#34C759',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: 'Oyun',
        population: totalByType.playing,
        color: '#AF52DE',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: 'Sağlık',
        population: totalByType.medical,
        color: '#FF3B30',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
    ].filter(item => item.population > 0);

    return { data: pieData, total: last7Days.reduce((sum, d) => sum + d.totalActivities, 0) };
  };

  const getDailyData = () => {
    const labels = data.map(d => d.date.split(' ')[0]);
    const totals = data.map(d => d.totalActivities);

    return {
      labels,
      datasets: [{
        data: totals,
        color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
      }],
    };
  };

  const getTrendsData = () => {
    const labels = data.map(d => d.date.split(' ')[0]);
    const feedingData = data.map(d => d.feeding);
    const sleepingData = data.map(d => d.sleeping);

    return {
      labels,
      datasets: [
        {
          data: feedingData,
          color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: sleepingData,
          color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
          strokeWidth: 2,
        },
      ],
      legends: ['Beslenme', 'Uyku'],
    };
  };

  const getDistributionData = () => {
    const labels = data.map(d => d.date.split(' ')[0]);
    const feedingData = data.map(d => d.feeding);
    const diaperData = data.map(d => d.diaper);
    const playingData = data.map(d => d.playing);

    return {
      labels,
      datasets: [
        {
          data: feedingData,
          color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
        },
        {
          data: diaperData,
          color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
        },
        {
          data: playingData,
          color: (opacity = 1) => `rgba(153, 102, 255, ${opacity})`,
        },
      ],
      legends: ['Beslenme', 'Bez', 'Oyun'],
    };
  };

  const getChartData = () => {
    switch (type) {
      case 'summary':
        return getSummaryData();
      case 'daily':
        return getDailyData();
      case 'trends':
        return getTrendsData();
      case 'distribution':
        return getDistributionData();
      default:
        return getDailyData();
    }
  };

  const chartData = getChartData();
  const mostActiveDay = data.reduce((max, d) => 
    d.totalActivities > max.totalActivities ? d : max
  , data[0]);

  const getAverageActivities = () => {
    const total = data.reduce((sum, d) => sum + d.totalActivities, 0);
    return (total / data.length).toFixed(1);
  };

  const getMostFrequentActivity = () => {
    const counts = {
      feeding: data.reduce((sum, d) => sum + d.feeding, 0),
      sleeping: data.reduce((sum, d) => sum + d.sleeping, 0),
      diaper: data.reduce((sum, d) => sum + d.diaper, 0),
      playing: data.reduce((sum, d) => sum + d.playing, 0),
      medical: data.reduce((sum, d) => sum + d.medical, 0),
    };

    const activities = {
      feeding: { name: 'Beslenme', icon: '🍼' },
      sleeping: { name: 'Uyku', icon: '😴' },
      diaper: { name: 'Bez', icon: '👶' },
      playing: { name: 'Oyun', icon: '🎮' },
      medical: { name: 'Sağlık', icon: '🏥' },
    };

    const mostFrequent = Object.entries(counts).reduce((a, [key, value]) => 
      value > a.count ? { type: key, count: value } : a
    , { type: '', count: 0 });

    return activities[mostFrequent.type as keyof typeof activities] || { name: 'Bilinmiyor', icon: '❓' };
  };

  const mostFrequent = getMostFrequentActivity();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {type === 'summary' ? 'Aktivite Özeti' :
           type === 'daily' ? 'Günlük Aktiviteler' :
           type === 'trends' ? 'Aktivite Trendleri' :
           'Aktivite Dağılımı'}
        </Text>
        <Text style={styles.subtitle}>{babyName} • {period}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Günlük Ortalama</Text>
          <Text style={styles.statValue}>{getAverageActivities()}</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>En Aktif Gün</Text>
          <Text style={styles.statValue}>{mostActiveDay.date.split(' ')[0]}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>En Sık Aktivite</Text>
          <Text style={styles.statValue}>{mostFrequent.icon} {mostFrequent.name}</Text>
        </View>
      </View>

      {type === 'summary' ? (
        <View style={styles.pieChartContainer}>
          <PieChart
            data={'data' in chartData ? chartData.data : []}
            width={screenWidth}
            height={chartHeight}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chartContainer}>
            {type === 'daily' ? (
              <BarChart
                data={'labels' in chartData ? chartData : { labels: [], datasets: [] }}
                width={Math.max(screenWidth, data.length * 70)}
                height={chartHeight}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
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
                  decimalPlaces: 0,
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

      {type !== 'summary' && 'legends' in chartData && chartData.legends && Array.isArray(chartData.legends) ? (
        <View style={styles.legendContainer}>
          {chartData.legends.map((legend: string, index: number) => {
            const dataset = 'datasets' in chartData && Array.isArray(chartData.datasets) ? chartData.datasets[index] : null;
            const colorFunc = dataset?.color;
            const color = colorFunc && typeof colorFunc === 'function' 
              ? colorFunc(1) 
              : '#007AFF';
            return (
              <View key={index} style={styles.legendItem}>
                <View style={[
                  styles.legendColor,
                  { backgroundColor: color as string }
                ]} />
                <Text style={styles.legendText}>{legend}</Text>
              </View>
            );
          })}
        </View>
      ) : null}

      <View style={styles.insightContainer}>
        <Text style={styles.insightTitle}>📊 Aktivite Analizi</Text>
        <Text style={styles.insightText}>
          {type === 'summary' 
            ? `Son 7 günde toplam ${'total' in chartData ? chartData.total : 0} aktivite kaydedildi. ${mostFrequent.icon} ${mostFrequent.name} en sık yapılan aktivite.`
            : type === 'daily'
            ? `Günlük ortalama ${getAverageActivities()} aktivite. ${mostActiveDay.date.split(' ')[0]} en aktif gündü.`
            : type === 'trends'
            ? `${mostFrequent.icon} ${mostFrequent.name} aktivitelerinde trend görünüyor. Tutarlılık önemlidir.`
            : `Aktivite dağılımı dengeli görünüyor. ${mostFrequent.name} öne çıkıyor.`
          }
        </Text>
        <Text style={styles.tipText}>
          💡 İpucu: Düzenli aktivite takibi bebeğinizin rutinini anlamada yardımcı olur.
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
    gap: 8,
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
    fontSize: 11,
    color: '#636E72',
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3436',
    textAlign: 'center',
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
    marginHorizontal: 6,
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
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 12,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 13,
    color: '#F57C00',
    lineHeight: 18,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#E65100',
    fontStyle: 'italic',
    lineHeight: 16,
  },
});

export default ActivityChart;