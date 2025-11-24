import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import {
  LineChart,
  BarChart,
  ProgressChart,
} from 'react-native-chart-kit';
import { useTheme } from '@/src/hooks/useTheme';
import { createText } from '@/src/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';

const ThemedText = createText();
const { width: screenWidth } = Dimensions.get('window');

interface HealthMetric {
  date: string;
  temperature: number;
  weight: number;
  height: number;
  healthScore: number;
}

interface VaccinationRecord {
  id: string;
  name: string;
  dueDate: string;
  administeredDate?: string;
  status: 'pending' | 'completed' | 'overdue';
  importance: 'critical' | 'important' | 'routine';
}

interface HealthMetricsDashboardProps {
  healthData: HealthMetric[];
  vaccinations: VaccinationRecord[];
  selectedMetric: 'temperature' | 'weight' | 'height' | 'score';
  onMetricChange: (metric: 'temperature' | 'weight' | 'height' | 'score') => void;
}

const HealthMetricsDashboard: React.FC<HealthMetricsDashboardProps> = React.memo(({
  healthData,
  vaccinations,
  selectedMetric,
  onMetricChange,
}) => {
  const { colors } = useTheme();
  const [animatedValue] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const healthMetricData = useMemo(() => {
    let data = [];
    let label = '';
    let color = '';
    let unit = '';

    switch (selectedMetric) {
      case 'temperature':
        data = healthData.map(item => item.temperature);
        label = 'Vücut Isısı';
        color = '#FF6B6B';
        unit = '°C';
        break;
      case 'weight':
        data = healthData.map(item => item.weight);
        label = 'Kilo';
        color = '#4ECDC4';
        unit = 'kg';
        break;
      case 'height':
        data = healthData.map(item => item.height);
        label = 'Boy';
        color = '#95E77E';
        unit = 'cm';
        break;
      case 'score':
        data = healthData.map(item => item.healthScore);
        label = 'Sağlık Skoru';
        color = '#4A90E2';
        unit = '/100';
        break;
    }

    return {
      labels: healthData.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
      }),
      datasets: [
        {
          data,
          color: () => color,
          strokeWidth: 3,
        },
      ],
      label,
      unit,
      color,
    };
  }, [healthData, selectedMetric]);

  const vaccinationStats = useMemo(() => {
    const completed = vaccinations.filter(v => v.status === 'completed').length;
    const pending = vaccinations.filter(v => v.status === 'pending').length;
    const overdue = vaccinations.filter(v => v.status === 'overdue').length;
    const total = vaccinations.length;

    return { completed, pending, overdue, total };
  }, [vaccinations]);

  const healthScoreDistribution = useMemo(() => ({
    labels: ['Sıcaklık', 'Kilo', 'Boy', 'Genel'],
    data: [
      healthData.length > 0 ? (healthData[healthData.length - 1].temperature - 35) / 2 : 0.5,
      healthData.length > 0 ? (healthData[healthData.length - 1].weight / 10) : 0.5,
      healthData.length > 0 ? (healthData[healthData.length - 1].height / 100) : 0.5,
      healthData.length > 0 ? healthData[healthData.length - 1].healthScore / 100 : 0.5,
    ],
  }), [healthData]);

  const criticalVaccinations = useMemo(() => {
    return vaccinations
      .filter(v => v.importance === 'critical' && v.status !== 'completed')
      .slice(0, 3);
  }, [vaccinations]);



  const chartConfig = {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: selectedMetric === 'temperature' ? 1 : 0,
    color: (opacity = 1) => healthMetricData.color,
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

  const latestHealthData = healthData[healthData.length - 1];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Metrik Seçici */}
      <View style={[styles.metricSelector, { backgroundColor: colors.card }]}>
        <ThemedText style={styles.sectionTitle}>Sağlık Metrikleri</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.metricButtons}>
            {[
              { key: 'temperature', label: 'Sıcaklık', icon: 'thermometer-outline' },
              { key: 'weight', label: 'Kilo', icon: 'fitness-outline' },
              { key: 'height', label: 'Boy', icon: 'resize-outline' },
              { key: 'score', label: 'Skor', icon: 'analytics-outline' },
            ].map((metric) => (
              <TouchableOpacity
                key={metric.key}
                style={[
                  styles.metricButton,
                  {
                    backgroundColor: selectedMetric === metric.key ? colors.primary : 'transparent',
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => onMetricChange(metric.key as any)}
              >
                <Ionicons
                  name={metric.icon as any}
                  size={16}
                  color={selectedMetric === metric.key ? 'white' : colors.text}
                />
                <ThemedText
                  style={[
                    styles.metricButtonText,
                    {
                      color: selectedMetric === metric.key ? 'white' : colors.text,
                    },
                  ]}
                >
                  {metric.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Genel Sağlık Durumu */}
      <View style={styles.overviewContainer}>
        <Animated.View
          style={[
            styles.healthScoreCard,
            { backgroundColor: colors.card, opacity: animatedValue },
          ]}
        >
          <View style={styles.healthScoreHeader}>
            <Ionicons name="heart" size={24} color="#FF6B6B" />
            <ThemedText style={styles.healthScoreTitle}>Genel Sağlık Skoru</ThemedText>
          </View>
          <ThemedText style={styles.healthScoreValue}>
            {latestHealthData?.healthScore || 0}/100
          </ThemedText>
          <ThemedText style={styles.healthScoreStatus}>
            {latestHealthData?.healthScore >= 80 ? 'Mükemmel' : 
             latestHealthData?.healthScore >= 60 ? 'İyi' : 
             latestHealthData?.healthScore >= 40 ? 'Orta' : 'Dikkat Edilmeli'}
          </ThemedText>
        </Animated.View>

        <View style={styles.quickStats}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Ionicons name="thermometer-outline" size={20} color="#FF6B6B" />
            <ThemedText style={styles.statValue}>
              {latestHealthData?.temperature || 0}°C
            </ThemedText>
            <ThemedText style={styles.statLabel}>Sıcaklık</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Ionicons name="fitness-outline" size={20} color="#4ECDC4" />
            <ThemedText style={styles.statValue}>
              {latestHealthData?.weight || 0}kg
            </ThemedText>
            <ThemedText style={styles.statLabel}>Kilo</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Ionicons name="resize-outline" size={20} color="#95E77E" />
            <ThemedText style={styles.statValue}>
              {latestHealthData?.height || 0}cm
            </ThemedText>
            <ThemedText style={styles.statLabel}>Boy</ThemedText>
          </View>
        </View>
      </View>

      {/* Sağlık Metrik Grafiği */}
      <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
        <ThemedText style={styles.chartTitle}>
          {healthMetricData.label} Geçmişi
        </ThemedText>
        <LineChart
          data={healthMetricData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={true}
          withOuterLines={true}
        />
        <ThemedText style={styles.chartUnit}>Birim: {healthMetricData.unit}</ThemedText>
      </View>

      {/* Sağlık Skoru Dağılımı */}
      <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
        <ThemedText style={styles.chartTitle}>Sağlık Skoru Dağılımı</ThemedText>
        <ProgressChart
          data={healthScoreDistribution}
          width={screenWidth - 40}
          height={200}
          strokeWidth={16}
          radius={32}
          chartConfig={{
            backgroundColor: colors.card,
            backgroundGradientFrom: colors.card,
            backgroundGradientTo: colors.card,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={styles.chart}
        />
      </View>

      {/* Aşı Takvimi Özeti */}
      <View style={[styles.vaccinationContainer, { backgroundColor: colors.card }]}>
        <View style={styles.vaccinationHeader}>
          <Ionicons name="medical-outline" size={20} color="#4A90E2" />
          <ThemedText style={styles.vaccinationTitle}>Aşı Takvimi</ThemedText>
        </View>
        
        <View style={styles.vaccinationStats}>
          <View style={styles.vaccinationStat}>
            <ThemedText style={styles.vaccinationStatValue}>
              {vaccinationStats.completed}
            </ThemedText>
            <ThemedText style={styles.vaccinationStatLabel}>Tamamlandı</ThemedText>
          </View>
          <View style={styles.vaccinationStat}>
            <ThemedText style={styles.vaccinationStatValue}>
              {vaccinationStats.pending}
            </ThemedText>
            <ThemedText style={styles.vaccinationStatLabel}>Bekliyor</ThemedText>
          </View>
          <View style={styles.vaccinationStat}>
            <ThemedText style={[styles.vaccinationStatValue, { color: '#FF6B6B' }]}>
              {vaccinationStats.overdue}
            </ThemedText>
            <ThemedText style={styles.vaccinationStatLabel}>Gecikmiş</ThemedText>
          </View>
        </View>

        {/* Kritik Aşılar */}
        {criticalVaccinations.length > 0 && (
          <View style={styles.criticalVaccines}>
            <ThemedText style={styles.criticalTitle}>Kritik Aşılar</ThemedText>
            {criticalVaccinations.map((vaccine) => (
              <View key={vaccine.id} style={styles.criticalVaccineItem}>
                <Ionicons 
                  name="warning-outline" 
                  size={16} 
                  color={vaccine.status === 'overdue' ? '#FF6B6B' : '#FFA500'} 
                />
                <ThemedText style={styles.criticalVaccineName}>
                  {vaccine.name}
                </ThemedText>
                <ThemedText style={styles.criticalVaccineDate}>
                  {new Date(vaccine.dueDate).toLocaleDateString('tr-TR')}
                </ThemedText>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Sağlık Özeti */}
      <View style={[styles.summaryContainer, { backgroundColor: colors.card }]}>
        <ThemedText style={styles.summaryTitle}>Sağlık Analiz Özeti</ThemedText>
        <View style={styles.summaryContent}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryEmoji}>📊</Text>
            <ThemedText style={styles.summaryText}>
              Güncel sağlık skoru: {latestHealthData?.healthScore || 0}/100
            </ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryEmoji}>🌡️</Text>
            <ThemedText style={styles.summaryText}>
              Vücut sıcaklığı normal aralıkta
            </ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryEmoji}>💉</Text>
            <ThemedText style={styles.summaryText}>
              {vaccinationStats.overdue > 0 ? 
                `${vaccinationStats.overdue} gecikmiş aşı var` : 
                vaccinationStats.pending > 0 ?
                `${vaccinationStats.pending} bekleyen aşı var` :
                'Tüm aşlar güncel'
              }
            </ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryEmoji}>📈</Text>
            <ThemedText style={styles.summaryText}>
              {latestHealthData?.healthScore >= 80 ? '✅ Sağlık durumu mükemmel' :
               latestHealthData?.healthScore >= 60 ? '✅ Sağlık durumu iyi' :
               latestHealthData?.healthScore >= 40 ? '⚠️ Sağlık durumu dikkat gerektiriyor' :
               '❌ Sağlık durumu kontrol edilmeli'}
            </ThemedText>
          </View>
        </View>
      </View>
    </ScrollView>
  );
});

export default HealthMetricsDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  metricSelector: {
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
  metricButtons: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  metricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  metricButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  overviewContainer: {
    marginBottom: 20,
  },
  healthScoreCard: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  healthScoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  healthScoreTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  healthScoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  healthScoreStatus: {
    fontSize: 14,
    opacity: 0.8,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.7,
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
  chartUnit: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 5,
  },
  vaccinationContainer: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  vaccinationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  vaccinationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  vaccinationStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  vaccinationStat: {
    alignItems: 'center',
  },
  vaccinationStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  vaccinationStatLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  criticalVaccines: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  criticalTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  criticalVaccineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  criticalVaccineName: {
    fontSize: 13,
    flex: 1,
    marginLeft: 8,
  },
  criticalVaccineDate: {
    fontSize: 12,
    opacity: 0.7,
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