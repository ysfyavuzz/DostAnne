import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import { Line } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

interface GrowthDataPoint {
  month: string;
  weight: number;
  height: number;
  headCircumference?: number;
  normalWeight: { min: number; max: number };
  normalHeight: { min: number; max: number };
  normalHead?: { min: number; max: number };
}

interface GrowthChartProps {
  data: GrowthDataPoint[];
  type: 'weight' | 'height' | 'head';
  babyName: string;
  currentAge: string;
}

const GrowthChart: React.FC<GrowthChartProps> = ({ 
  data, 
  type, 
  babyName, 
  currentAge 
}) => {
  const screenWidth = Dimensions.get('window').width - 40;
  const chartHeight = 220;

  const getChartData = () => {
    const labels = data.map(d => d.month);
    let datasets: any[] = [];
    let legends: string[] = [];

    switch (type) {
      case 'weight':
        datasets = [
          {
            data: data.map(d => d.weight),
            color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
            strokeWidth: 3,
          },
          {
            data: data.map(d => d.normalWeight.min),
            color: (opacity = 1) => `rgba(54, 162, 235, ${opacity * 0.3})`,
            strokeWidth: 1,
          },
          {
            data: data.map(d => d.normalWeight.max),
            color: (opacity = 1) => `rgba(54, 162, 235, ${opacity * 0.3})`,
            strokeWidth: 1,
          },
        ];
        legends = ['Gerçek Kilo', 'Normal Min', 'Normal Max'];
        break;
        
      case 'height':
        datasets = [
          {
            data: data.map(d => d.height),
            color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
            strokeWidth: 3,
          },
          {
            data: data.map(d => d.normalHeight.min),
            color: (opacity = 1) => `rgba(153, 102, 255, ${opacity * 0.3})`,
            strokeWidth: 1,
          },
          {
            data: data.map(d => d.normalHeight.max),
            color: (opacity = 1) => `rgba(153, 102, 255, ${opacity * 0.3})`,
            strokeWidth: 1,
          },
        ];
        legends = ['Gerçek Boy', 'Normal Min', 'Normal Max'];
        break;
        
      case 'head':
        datasets = [
          {
            data: data.map(d => d.headCircumference || 0),
            color: (opacity = 1) => `rgba(255, 159, 64, ${opacity})`,
            strokeWidth: 3,
          },
        ];
        legends = ['Baş Çevresi'];
        break;
    }

    return { labels, datasets, legends };
  };

  const { labels, datasets, legends } = getChartData();
  const latestData = data[data.length - 1];

  const getUnit = () => {
    switch (type) {
      case 'weight': return 'kg';
      case 'height': return 'cm';
      case 'head': return 'cm';
      default: return '';
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'weight': return 'Kilo Gelişimi';
      case 'height': return 'Boy Gelişimi';
      case 'head': return 'Baş Çevresi Gelişimi';
      default: return '';
    }
  };

  const getCurrentValue = () => {
    switch (type) {
      case 'weight': return latestData.weight;
      case 'height': return latestData.height;
      case 'head': return latestData.headCircumference;
      default: return 0;
    }
  };

  const getNormalRange = () => {
    switch (type) {
      case 'weight':
        return `${latestData.normalWeight.min}-${latestData.normalWeight.max} ${getUnit()}`;
      case 'height':
        return `${latestData.normalHeight.min}-${latestData.normalHeight.max} ${getUnit()}`;
      case 'head':
        return latestData.normalHead ? 
          `${latestData.normalHead.min}-${latestData.normalHead.max} ${getUnit()}` : 
          '-';
      default: return '';
    }
  };

  const isInNormalRange = () => {
    const current = getCurrentValue();
    switch (type) {
      case 'weight':
        return current >= latestData.normalWeight.min && current <= latestData.normalWeight.max;
      case 'height':
        return current >= latestData.normalHeight.min && current <= latestData.normalHeight.max;
      case 'head':
        return latestData.normalHead && 
               current >= latestData.normalHead.min && 
               current <= latestData.normalHead.max;
      default:
        return false;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getTitle()}</Text>
        <Text style={styles.subtitle}>{babyName} • {currentAge}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Mevcut Değer</Text>
          <Text style={styles.statValue}>
            {getCurrentValue()} {getUnit()}
          </Text>
          <View style={[styles.statusIndicator, { 
            backgroundColor: isInNormalRange() ? '#34C759' : '#FF9500' 
          }]}>
            <Text style={styles.statusText}>
              {isInNormalRange() ? 'Normal' : 'Dikkat'}
            </Text>
          </View>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Normal Aralık</Text>
          <Text style={styles.statValue}>{getNormalRange()}</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chartContainer}>
          <LineChart
            data={{
              labels,
              datasets,
              legend: legends,
            }}
            width={Math.max(screenWidth, data.length * 80)}
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
                r: '6',
                strokeWidth: '2',
                stroke: '#ffffff',
              },
              propsForLabels: {
                fontSize: 12,
                fontWeight: '500',
              },
              propsForBackgroundLines: {
                strokeDasharray: '',
                stroke: '#e0e0e0',
                strokeWidth: 1,
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>
      </ScrollView>

      <View style={styles.legendContainer}>
        {legends.map((legend, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[
              styles.legendColor,
              { backgroundColor: datasets[0].color(1) }
            ]} />
            <Text style={styles.legendText}>{legend}</Text>
          </View>
        ))}
      </View>

      <View style={styles.insightContainer}>
        <Text style={styles.insightTitle}>💡 Gelişim İçgörüsü</Text>
        <Text style={styles.insightText}>
          {isInNormalRange() 
            ? `${babyName} şu anki ${type === 'weight' ? 'kilo' : type === 'height' ? 'boy' : 'baş çevresi'} değeri normal aralıkta. Gelişimi sağlıklı seyrediyor!`
            : `${babyName} şu anki değeri normal aralığın dışında. Doktorunuza danışmanızı öneririz.`
          }
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
    marginBottom: 4,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  chartContainer: {
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
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 12,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565C0',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 13,
    color: '#1976D2',
    lineHeight: 18,
  },
});

export default GrowthChart;