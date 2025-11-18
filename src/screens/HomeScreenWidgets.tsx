import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/hooks/useTheme';
import { createText } from '@/src/components/ThemedText';
import { 
  DashboardGrid,
  QuickStatsWidget,
  GrowthChartWidget,
  NextActionWidget,
  MilestoneWidget,
  MemoryWidget,
} from '@/src/components/advanced/WidgetSystem';

const ThemedText = createText();
const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreenWidgets() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [widgetData, setWidgetData] = useState<any>({});

  useEffect(() => {
    loadWidgetData();
  }, []);

  const loadWidgetData = async () => {
    // Simulate data loading
    const mockData = {
      quickStats: {
        feeding: 6,
        sleep: 8.5,
        health: 95,
      },
      growthData: [
        { weight: 4.2 },
        { weight: 4.3 },
        { weight: 4.4 },
        { weight: 4.5 },
        { weight: 4.6 },
        { weight: 4.7 },
        { weight: 4.8 },
      ],
      nextActions: [
        { icon: 'restaurant', text: 'Beslenme zamanı', time: '14:30', color: colors.primary },
        { icon: 'medical', text: 'Aşı randevusu', time: 'Yarın 10:00', color: colors.warning },
        { icon: 'moon', text: 'Uyku zamanı', time: '20:00', color: colors.secondary },
      ],
      milestone: {
        emoji: '👶',
        title: 'Emekleme',
        age: '6-9 ay',
      },
      memory: {
        emoji: '😊',
        title: 'İlk Gülümseme',
        date: '2 ay önce',
      },
    };
    
    setWidgetData(mockData);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWidgetData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const widgets = [
    <QuickStatsWidget key="stats" data={widgetData.quickStats} />,
    <GrowthChartWidget key="growth" data={widgetData.growthData || []} />,
    <NextActionWidget key="actions" actions={widgetData.nextActions || []} />,
    <MilestoneWidget key="milestone" milestone={widgetData.milestone} />,
    <MemoryWidget key="memory" memory={widgetData.memory} />,
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.welcomeText}>Hoş Geldiniz! 👋</ThemedText>
          <ThemedText style={styles.dateText}>
            {new Date().toLocaleDateString('tr-TR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </ThemedText>
        </View>
        <TouchableOpacity style={[styles.settingsButton, { backgroundColor: colors.card }]}>
          <Ionicons name="settings-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <DashboardGrid 
        widgets={widgets} 
        editable={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    opacity: 0.7,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});