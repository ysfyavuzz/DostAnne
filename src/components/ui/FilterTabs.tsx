/**
 * FilterTabs Component
 * Horizontal tabs for filtering content
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';

interface FilterTab {
  id: string;
  title: string;
}

interface FilterTabsProps {
  tabs: readonly FilterTab[];
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ tabs, activeTab, onTabPress }) => {
  const { colors, typography, spacing, borderRadius } = useThemedStyles();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              {
                backgroundColor: isActive ? colors.brand.green[500] : colors.neutral[100],
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.lg,
                borderRadius: borderRadius.full,
              },
            ]}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                typography.label,
                {
                  color: isActive ? 'white' : colors.text.secondary,
                  fontWeight: isActive ? '600' : '500',
                },
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  tab: {
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
