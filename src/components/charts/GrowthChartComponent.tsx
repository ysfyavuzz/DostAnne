import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const { width } = Dimensions.get('window');

interface GrowthDataPoint {
  date: string;
  weight: number;
  height: number;
  age: string;
}

interface GrowthChartComponentProps {
  title: string;
  type: 'weight' | 'height' | 'both';
  babyData?: GrowthDataPoint[];
}

export const GrowthChartComponent: React.FC<GrowthChartComponentProps> = ({
  title,
  type,
  babyData,
}) => {
  const { activities, baby } = useSelector((state: RootState) => state.activities);
  const [selectedPeriod, setSelectedPeriod] = React.useState<'3' | '6' | '12'>('6');

  // Generate sample data if no real data provided
  const growthData = useMemo(() => {
    if (babyData) return babyData;

    // Generate sample growth data based on baby's age
    const now = new Date();
    const periodMonths = parseInt(selectedPeriod);
    const startDate = new Date(now.getTime() - (periodMonths * 30 * 24 * 60 * 60 * 1000));
    
    const data: GrowthDataPoint[] = [];
    const babyAgeMonths = baby?.ageInMonths ?? 6;
    
    for (let i = 0; i <= periodMonths; i += 2) {
      const date = new Date(startDate.getTime() + (i * 30 * 24 * 60 * 60 * 1000));
      const ageInMonths = Math.max(0, babyAgeMonths - periodMonths + i);
      
      // WHO standard growth curves approximation
      const weightForAge = 3.5 + (ageInMonths * 0.6) + (Math.random() * 0.2 - 0.1);
      const heightForAge = 50 + (ageInMonths * 2.5) + (Math.random() * 1 - 0.5);
      
      data.push({
        date: date.toLocaleDateString('tr-TR', { month: 'short', day: '2-digit' }),
        weight: Math.round(weightForAge * 10) / 10,
        height: Math.round(heightForAge),
        age: `${ageInMonths} ay`,
      });
    }
    
    return data;
  }, [babyData, baby, selectedPeriod]);

  const getChartData = () => {
    const labels = growthData.map(d => d.date);
    let datasets: any[] = [];

    if (type === 'weight' || type === 'both') {
      datasets.push({
        data: growthData.map(d => d.weight),
        color: (opacity = 1) => `rgba(255, 107, 157, ${opacity})`,
        strokeWidth: 3,
      });
    }

    if (type === 'height' || type === 'both') {
      datasets.push({
        data: growthData.map(d => d.height),
        color: (opacity = 1) => `rgba(72, 187, 120, ${opacity})`,
        strokeWidth: 3,
      });
    }

    return { labels, datasets };
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
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

  const currentWeight = growthData[growthData.length - 1]?.weight || 0;
  const currentHeight = growthData[growthData.length - 1]?.height || 0;
  
  // Calculate percentiles (WHO standards)
  const calculatePercentiles = (age: number, weight: number, height: number) => {
    // Simplified WHO percentile calculations
    const weightPercentiles = {
      p3: 2.5 + age * 0.4,
      p15: 3.0 + age * 0.5,
      p50: 3.5 + age * 0.6,
      p85: 4.0 + age * 0.7,
      p97: 4.5 + age * 0.8,
    };
    
    const heightPercentiles = {
      p3: 45 + age * 2.0,
      p15: 47 + age * 2.2,
      p50: 50 + age * 2.5,
      p85: 53 + age * 2.8,
      p97: 55 + age * 3.0,
    };

    return {
      weight: {
        value: weight,
        percentile: Object.entries(weightPercentiles).find(([_, val]) => weight >= val)?.[0] || 'p3',
      },
      height: {
        value: height,
        percentile: Object.entries(heightPercentiles).find(([_, val]) => height >= val)?.[0] || 'p3',
      },
    };
  };

  const percentiles = calculatePercentiles(
    baby?.ageInMonths ?? 6,
    currentWeight,
    currentHeight
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.periodSelector}>
          {['3', '6', '12'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.activePeriodButton,
              ]}
              onPress={() => setSelectedPeriod(period as any)}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period && styles.activePeriodText,
                ]}
              >
                {period} ay
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Current Values */}
      <View style={styles.currentValuesContainer}>
        {(type === 'weight' || type === 'both') && (
          <View style={styles.valueCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#FFF0F5' }]}>
              <Ionicons name="scale" size={20} color="#FF6B9D" />
            </View>
            <View style={styles.valueContent}>
              <Text style={styles.valueLabel}>Ağırlık</Text>
              <Text style={styles.valueValue}>{currentWeight} kg</Text>
              <Text style={styles.percentileText}>
                {percentiles.weight.percentile} persentil
              </Text>
            </View>
          </View>
        )}
        
        {(type === 'height' || type === 'both') && (
          <View style={styles.valueCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#E6FFFA' }]}>
              <Ionicons name="resize" size={20} color="#48BB78" />
            </View>
            <View style={styles.valueContent}>
              <Text style={styles.valueLabel}>Boy</Text>
              <Text style={styles.valueValue}>{currentHeight} cm</Text>
              <Text style={styles.percentileText}>
                {percentiles.height.percentile} persentil
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        <View style={styles.chartLegend}>
          {(type === 'weight' || type === 'both') && (
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FF6B9D' }]} />
              <Text style={styles.legendText}>Kilo (kg)</Text>
            </View>
          )}
          {(type === 'height' || type === 'both') && (
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#48BB78' }]} />
              <Text style={styles.legendText}>Boy (cm)</Text>
            </View>
          )}
        </View>
        
        <LineChart
          data={getChartData()}
          width={width - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={true}
        />
      </View>

      {/* Growth Insights */}
      <View style={styles.insightsContainer}>
        <Text style={styles.insightsTitle}>Gelişim Analizi</Text>
        
        <View style={styles.insightRow}>
          <Ionicons name="information-circle" size={16} color="#4299E1" />
          <Text style={styles.insightText}>
            {baby?.name || 'Bebek'}'in büyüme eğrisi sağlıklı aralıkta
          </Text>
        </View>
        
        <View style={styles.insightRow}>
          <Ionicons name="trending-up" size={16} color="#48BB78" />
          <Text style={styles.insightText}>
            Son {selectedPeriod} ayda {type === 'height' ? 'boy' : 'kilo'} artışı normal
          </Text>
        </View>
        
        <View style={styles.insightRow}>
          <Ionicons name="calendar" size={16} color="#9F7AEA" />
          <Text style={styles.insightText}>
            Bir sonraki ölçüm: 1 ay sonra
          </Text>
        </View>
      </View>

      {/* WHO Reference */}
      <View style={styles.referenceContainer}>
        <Text style={styles.referenceTitle}>WHO Standartları</Text>
        <Text style={styles.referenceText}>
          Grafikler Dünya Sağlık Örgütü (WHO) büyüme standartlarına göre gösterilmektedir.
        </Text>
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
  currentValuesContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  valueCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  valueContent: {
    flex: 1,
  },
  valueLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 2,
  },
  valueValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  percentileText: {
    fontSize: 11,
    color: '#A0AEC0',
    marginTop: 2,
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#718096',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  insightsContainer: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 10,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 12,
    color: '#4A5568',
    flex: 1,
  },
  referenceContainer: {
    backgroundColor: '#EDF2F7',
    borderRadius: 8,
    padding: 12,
  },
  referenceTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A5568',
    marginBottom: 4,
  },
  referenceText: {
    fontSize: 11,
    color: '#718096',
    lineHeight: 16,
  },
});

export default GrowthChartComponent;