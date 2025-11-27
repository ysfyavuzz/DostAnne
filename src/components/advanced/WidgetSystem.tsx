import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

const ThemedText = Text;
const { width: screenWidth } = Dimensions.get('window');

interface WidgetProps {
  title: string;
  size: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onPress?: () => void;
}

const Widget: React.FC<WidgetProps> = ({ title, size, children, onPress }) => {
  const { colors } = useTheme();
  
  const getSizeStyle = () => {
    switch (size) {
      case 'small': return { width: (screenWidth - 60) / 2, height: 120 };
      case 'medium': return { width: (screenWidth - 40) / 2, height: 180 };
      case 'large': return { width: screenWidth - 40, height: 200 };
      default: return { width: screenWidth - 40, height: 150 };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.widget,
        getSizeStyle(),
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <ThemedText style={styles.widgetTitle}>{title}</ThemedText>
      <View style={styles.widgetContent}>
        {children}
      </View>
    </TouchableOpacity>
  );
};

export const QuickStatsWidget: React.FC<{ data: any }> = ({ data }) => {
  const { colors } = useTheme();
  
  return (
    <Widget title="Bugün" size="medium">
      <View style={styles.quickStats}>
        <View style={styles.statItem}>
          <Ionicons name="restaurant" size={16} color={colors.primary} />
          <ThemedText style={styles.statValue}>{data.feeding || 0}</ThemedText>
          <ThemedText style={styles.statLabel}>Beslenme</ThemedText>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="moon" size={16} color={colors.secondary} />
          <ThemedText style={styles.statValue}>{data.sleep || 0}h</ThemedText>
          <ThemedText style={styles.statLabel}>Uyku</ThemedText>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="medical" size={16} color={colors.success} />
          <ThemedText style={styles.statValue}>{data.health || 0}</ThemedText>
          <ThemedText style={styles.statLabel}>Sağlık</ThemedText>
        </View>
      </View>
    </Widget>
  );
};

export const GrowthChartWidget: React.FC<{ data: any[] }> = ({ data }) => {
  const { colors } = useTheme();
  
  const chartData = {
    labels: ['Hft', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
    datasets: [
      {
        data: data.map(d => d.weight || 4),
        color: () => colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 1,
    color: () => colors.text,
    labelColor: () => colors.textSecondary,
    style: { borderRadius: 16 },
    propsForDots: { r: '3', strokeWidth: '2', stroke: colors.primary },
  };

  return (
    <Widget title="Kilo Gelişimi" size="large">
      <LineChart
        data={chartData}
        width={screenWidth - 80}
        height={140}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </Widget>
  );
};

export const NextActionWidget: React.FC<{ actions: any[] }> = ({ actions }) => {
  const { colors } = useTheme();
  
  return (
    <Widget title="Sıradaki Eylemler" size="medium">
      <ScrollView showsVerticalScrollIndicator={false}>
        {actions.slice(0, 3).map((action, index) => (
          <View key={index} style={styles.actionItem}>
            <Ionicons 
              name={action.icon as any} 
              size={16} 
              color={action.color || colors.primary} 
            />
            <ThemedText style={styles.actionText}>{action.text}</ThemedText>
            <ThemedText style={styles.actionTime}>{action.time}</ThemedText>
          </View>
        ))}
      </ScrollView>
    </Widget>
  );
};

export const MilestoneWidget: React.FC<{ milestone: any }> = ({ milestone }) => {
  const { colors } = useTheme();
  
  return (
    <Widget title="Gelişim Kilometre Taşı" size="small">
      <View style={styles.milestoneContent}>
        <Text style={styles.milestoneEmoji}>{milestone.emoji}</Text>
        <ThemedText style={styles.milestoneTitle}>{milestone.title}</ThemedText>
        <ThemedText style={styles.milestoneAge}>{milestone.age}</ThemedText>
      </View>
    </Widget>
  );
};

export const MemoryWidget: React.FC<{ memory: any }> = ({ memory }) => {
  const { colors } = useTheme();
  
  return (
    <Widget title="Anı" size="small">
      <View style={styles.memoryContent}>
        <Text style={styles.memoryEmoji}>{memory.emoji}</Text>
        <ThemedText style={styles.memoryTitle}>{memory.title}</ThemedText>
        <ThemedText style={styles.memoryDate}>{memory.date}</ThemedText>
      </View>
    </Widget>
  );
};

interface DashboardGridProps {
  widgets: React.ReactNode[];
  editable?: boolean;
  onWidgetPress?: (widgetType: string) => void;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  widgets,
  editable = false,
  onWidgetPress,
}) => {
  const { colors } = useTheme();
  const [draggedWidget, setDraggedWidget] = useState<number | null>(null);

  return (
    <ScrollView style={styles.dashboard} showsVerticalScrollIndicator={false}>
      <View style={styles.grid}>
        {widgets.map((widget, index) => (
          <View key={index} style={styles.gridItem}>
            {widget}
          </View>
        ))}
      </View>
      
      {editable && (
        <View style={[styles.addWidget, { backgroundColor: colors.card }]}>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color={colors.primary} />
            <ThemedText style={styles.addText}>Widget Ekle</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dashboard: {
    flex: 1,
    padding: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    marginBottom: 10,
  },
  widget: {
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  widgetTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  widgetContent: {
    flex: 1,
  },
  quickStats: {
    flex: 1,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.7,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionText: {
    flex: 1,
    fontSize: 12,
    marginLeft: 8,
  },
  actionTime: {
    fontSize: 11,
    opacity: 0.7,
  },
  milestoneContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  milestoneEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  milestoneTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  milestoneAge: {
    fontSize: 10,
    opacity: 0.7,
    textAlign: 'center',
  },
  memoryContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  memoryEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  memoryTitle: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  memoryDate: {
    fontSize: 9,
    opacity: 0.7,
    textAlign: 'center',
  },
  addWidget: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
