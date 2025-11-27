import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
} from 'react-native-chart-kit';
import { useTheme } from '@/src/hooks/useTheme';


const ThemedText = Text;
const { width: screenWidth } = Dimensions.get('window');

interface FeedingData {
  date: string;
  breast: number;
  bottle: number;
  solid: number;
  total: number;
}

interface TimeDistributionData {
  time: string;
  count: number;
  percentage: number;
}

interface FeedingAnalysisChartProps {
  data: FeedingData[];
  timeDistribution: TimeDistributionData[];
  selectedPeriod: '7' | '30' | '90';
  onPeriodChange: (period: '7' | '30' | '90') => void;
}

export default function FeedingAnalysisChart({
  data,
  timeDistribution,
  selectedPeriod,
  onPeriodChange,
}: FeedingAnalysisChartProps) {
  const { colors } = useTheme();

  const getDailyFeedingData = () => ({
    labels: data.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    }),
    datasets: [
      {
        data: data.map(item => item.breast),
        color: () => '#FF6B9D',
        label: 'Anne Sütü',
      },
      {
        data: data.map(item => item.bottle),
        color: () => '#4ECDC4',
        label: 'Mama',
      },
      {
        data: data.map(item => item.solid),
        color: () => '#95E77E',
        label: 'Ek Gıda',
      },
    ],
    legend: ['Anne Sütü', 'Mama', 'Ek Gıda'],
  });

  const getTotalFeedingData = () => ({
    labels: data.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    }),
    datasets: [
      {
        data: data.map(item => item.total),
        color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  });

  const getFeedingTypeDistribution = () => {
    const totals = data.reduce(
      (acc, item) => ({
        breast: acc.breast + item.breast,
        bottle: acc.bottle + item.bottle,
        solid: acc.solid + item.solid,
      }),
      { breast: 0, bottle: 0, solid: 0 }
    );

    return [
      {
        name: 'Anne Sütü',
        population: totals.breast,
        color: '#FF6B9D',
        legendFontColor: colors.text,
        legendFontSize: 12,
      },
      {
        name: 'Mama',
        population: totals.bottle,
        color: '#4ECDC4',
        legendFontColor: colors.text,
        legendFontSize: 12,
      },
      {
        name: 'Ek Gıda',
        population: totals.solid,
        color: '#95E77E',
        legendFontColor: colors.text,
        legendFontSize: 12,
      },
    ];
  };

  const getTimeDistributionData = () => ({
    labels: timeDistribution.map(item => item.time),
    datasets: [
      {
        data: timeDistribution.map(item => item.count),
        color: (opacity = 1) => `rgba(255, 107, 157, ${opacity})`,
      },
    ],
  });

  const chartConfig = {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#e0e0e0',
    },
  };

  const totalFeedings = data.reduce((sum, item) => sum + item.total, 0);
  const avgDailyFeedings = Math.round(totalFeedings / data.length);
  const mostActiveHour = timeDistribution.reduce((max, item) => 
    item.count > max.count ? item : max, timeDistribution[0]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Periyot Seçimi */}
      <View style={[styles.periodSelector, { backgroundColor: colors.card }]}>
        <ThemedText style={styles.sectionTitle}>Beslenme Analizi</ThemedText>
        <View style={styles.periodButtons}>
          {(['7', '30', '90'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                {
                  backgroundColor: selectedPeriod === period ? colors.primary : 'transparent',
                  borderColor: colors.border,
                },
              ]}
              onPress={() => onPeriodChange(period)}
            >
              <ThemedText
                style={[
                  styles.periodButtonText,
                  {
                    color: selectedPeriod === period ? 'white' : colors.text,
                  },
                ]}
              >
                Son {period} gün
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* İstatistik Kartları */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.statValue}>{totalFeedings}</ThemedText>
          <ThemedText style={styles.statLabel}>Toplam Beslenme</ThemedText>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.statValue}>{avgDailyFeedings}</ThemedText>
          <ThemedText style={styles.statLabel}>Günlük Ortalama</ThemedText>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.statValue}>{mostActiveHour?.time || '-'}</ThemedText>
          <ThemedText style={styles.statLabel}>En Aktif Saat</ThemedText>
        </View>
      </View>

      {/* Günlük Beslenme Grafiği */}
      <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
        <ThemedText style={styles.chartTitle}>Günlük Beslenme Dağılımı</ThemedText>
        <LineChart
          data={getDailyFeedingData()}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={true}
          withHorizontalLines={true}
        />
      </View>

      {/* Toplam Miktar Grafiği */}
      <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
        <ThemedText style={styles.chartTitle}>Toplam Beslenme Miktarı</ThemedText>
        <LineChart
          data={getTotalFeedingData()}
          width={screenWidth - 40}
          height={200}
          chartConfig={chartConfig}
          style={styles.chart}
          bezier
        />
      </View>

      {/* Beslenme Türü Dağılımı */}
      <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
        <ThemedText style={styles.chartTitle}>Beslenme Türü Dağılımı</ThemedText>
        <PieChart
          data={getFeedingTypeDistribution()}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 10]}
          absolute
          style={styles.chart}
        />
      </View>

      {/* Zaman Dağılımı */}
      <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
        <ThemedText style={styles.chartTitle}>Saatlere Göre Beslenme Dağılımı</ThemedText>
        <BarChart
          data={getTimeDistributionData()}
          width={screenWidth - 40}
          height={200}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={chartConfig}
          style={styles.chart}
          showValuesOnTopOfBars={true}
        />
      </View>

      {/* Analiz Özeti */}
      <View style={[styles.summaryContainer, { backgroundColor: colors.card }]}>
        <ThemedText style={styles.summaryTitle}>Beslenme Analiz Özeti</ThemedText>
        <View style={styles.summaryContent}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryEmoji}>📊</Text>
            <ThemedText style={styles.summaryText}>
              Son {selectedPeriod} günde {totalFeedings} beslenme kaydı
            </ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryEmoji}>🕐</Text>
            <ThemedText style={styles.summaryText}>
              En aktif saat: {mostActiveHour?.time} ({mostActiveHour?.count} kez)
            </ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryEmoji}>📈</Text>
            <ThemedText style={styles.summaryText}>
              Günlük ortalama: {avgDailyFeedings} beslenme
            </ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryEmoji}>🎯</Text>
            <ThemedText style={styles.summaryText}>
              {avgDailyFeedings >= 6 ? '✅ Beslenme düzeni iyi' : '⚠️ Beslenme sıklığı artırılmalı'}
            </ThemedText>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  periodSelector: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  periodButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  periodButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.7,
    textAlign: 'center',
  },
  chartContainer: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  summaryContainer: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryContent: {
    gap: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  summaryText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});
