import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LineChart, BarChart, PieChart, ProgressChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Enhanced Line Chart Component
interface EnhancedLineChartProps {
  data: any;
  title: string;
  height?: number;
  color?: string;
  showDots?: boolean;
  bezier?: boolean;
  onPeriodChange?: (period: string) => void;
  selectedPeriod?: string;
}

export const EnhancedLineChart: React.FC<EnhancedLineChartProps> = ({
  data,
  title,
  height = 220,
  color = '#FF6B9D',
  showDots = true,
  bezier = true,
  onPeriodChange,
  selectedPeriod = '7',
}) => {
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
    propsForDots: showDots ? {
      r: '4',
      strokeWidth: '2',
      stroke: color,
    } : {},
    propsForLabels: {
      fontSize: 10,
    },
  };

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>{title}</Text>
        {onPeriodChange && (
          <View style={styles.periodSelector}>
            {['7', '30', '90'].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.activePeriodButton,
                ]}
                onPress={() => onPeriodChange(period)}
              >
                <Text
                  style={[
                    styles.periodText,
                    selectedPeriod === period && styles.activePeriodText,
                  ]}
                >
                  {period}g
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      
      {data.datasets && data.datasets.length > 0 && data.datasets[0].data.length > 0 ? (
        <LineChart
          data={data}
          width={width - 40}
          height={height}
          chartConfig={chartConfig}
          bezier={bezier}
          style={styles.chart}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Ionicons name="bar-chart" size={48} color="#CBD5E0" />
          <Text style={styles.noDataText}>Veri bulunmuyor</Text>
        </View>
      )}
    </View>
  );
};

// Progress Ring Component
interface ProgressRingProps {
  size?: number;
  progress: number;
  strokeWidth?: number;
  backgroundColor?: string;
  progressColor?: string;
  title: string;
  subtitle?: string;
  icon?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  size = 120,
  progress,
  strokeWidth = 8,
  backgroundColor = '#E2E8F0',
  progressColor = '#FF6B9D',
  title,
  subtitle,
  icon,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  return (
    <View style={[styles.progressRingContainer, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      <View style={styles.progressContent}>
        {icon && (
          <Ionicons name={icon as any} size={20} color={progressColor} />
        )}
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        <Text style={styles.progressTitle}>{title}</Text>
        {subtitle && <Text style={styles.progressSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

// Activity Heatmap Component
interface ActivityHeatmapProps {
  data: number[][];
  title: string;
  maxValue: number;
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  data,
  title,
  maxValue,
}) => {
  const getIntensityColor = (value: number) => {
    const intensity = value / maxValue;
    if (intensity === 0) return '#F7FAFC';
    if (intensity < 0.25) return '#E6FFFA';
    if (intensity < 0.5) return '#B2F5EA';
    if (intensity < 0.75) return '#48BB78';
    return '#22543D';
  };

  return (
    <View style={styles.heatmapContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.heatmapGrid}>
        {data.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.heatmapRow}>
            {week.map((day, dayIndex) => (
              <View
                key={dayIndex}
                style={[
                  styles.heatmapCell,
                  { backgroundColor: getIntensityColor(day) },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.heatmapLegend}>
        <Text style={styles.legendText}>Az</Text>
        <View style={styles.legendColors}>
          <View style={[styles.legendColor, { backgroundColor: '#F7FAFC' }]} />
          <View style={[styles.legendColor, { backgroundColor: '#E6FFFA' }]} />
          <View style={[styles.legendColor, { backgroundColor: '#B2F5EA' }]} />
          <View style={[styles.legendColor, { backgroundColor: '#48BB78' }]} />
          <View style={[styles.legendColor, { backgroundColor: '#22543D' }]} />
        </View>
        <Text style={styles.legendText}>Çok</Text>
      </View>
    </View>
  );
};

// Comparison Bar Chart Component
interface ComparisonBarChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      color?: (opacity: number) => string;
    }[];
  };
  title: string;
  height?: number;
}

export const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({
  data,
  title,
  height = 200,
}) => {
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
    propsForLabels: {
      fontSize: 10,
    },
  };

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <BarChart
        data={data}
        width={width - 40}
        height={height}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={chartConfig}
        style={styles.chart}
        showValuesOnTopOfBars
      />
    </View>
  );
};

// Growth Chart Component
interface GrowthChartProps {
  data: {
    weight: number[];
    height: number[];
    age: string[];
  };
  babyName: string;
  type: 'weight' | 'height' | 'both';
}

export const GrowthChart: React.FC<GrowthChartProps> = ({
  data,
  babyName,
  type,
}) => {
  const getChartData = () => {
    switch (type) {
      case 'weight':
        return {
          labels: data.age,
          datasets: [{
            data: data.weight,
            color: (opacity = 1) => `rgba(255, 107, 157, ${opacity})`,
            strokeWidth: 2,
          }],
        };
      case 'height':
        return {
          labels: data.age,
          datasets: [{
            data: data.height,
            color: (opacity = 1) => `rgba(72, 187, 120, ${opacity})`,
            strokeWidth: 2,
          }],
        };
      case 'both':
        return {
          labels: data.age,
          datasets: [
            {
              data: data.weight,
              color: (opacity = 1) => `rgba(255, 107, 157, ${opacity})`,
              strokeWidth: 2,
            },
            {
              data: data.height,
              color: (opacity = 1) => `rgba(72, 187, 120, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        };
    }
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
      r: '3',
      strokeWidth: '2',
    },
  };

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{babyName} - Gelişim Grafiği</Text>
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
      />
    </View>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
}) => {
  return (
    <View style={styles.statsCard}>
      <View style={[styles.statsIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <View style={styles.statsContent}>
        <Text style={styles.statsTitle}>{title}</Text>
        <Text style={styles.statsValue}>{value}</Text>
        {subtitle && <Text style={styles.statsSubtitle}>{subtitle}</Text>}
        {trend && (
          <View style={styles.trendContainer}>
            <Ionicons
              name={trend.isUp ? 'trending-up' : 'trending-down'}
              size={12}
              color={trend.isUp ? '#48BB78' : '#F56565'}
            />
            <Text
              style={[
                styles.trendText,
                { color: trend.isUp ? '#48BB78' : '#F56565' },
              ]}
            >
              %{Math.abs(trend.value)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
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
  progressRingContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginTop: 4,
  },
  progressTitle: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  progressSubtitle: {
    fontSize: 10,
    color: '#A0AEC0',
  },
  heatmapContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heatmapGrid: {
    marginTop: 15,
  },
  heatmapRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  heatmapCell: {
    width: 12,
    height: 12,
    marginRight: 2,
    borderRadius: 2,
  },
  heatmapLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  legendColors: {
    flexDirection: 'row',
    gap: 4,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 3,
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
  statsCard: {
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
  statsIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statsContent: {
    flex: 1,
  },
  statsTitle: {
    fontSize: 12,
    color: '#718096',
  },
  statsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  statsSubtitle: {
    fontSize: 10,
    color: '#A0AEC0',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '500',
  },
});

export default {
  EnhancedLineChart,
  ProgressRing,
  ActivityHeatmap,
  ComparisonBarChart,
  GrowthChart,
  StatsCard,
};