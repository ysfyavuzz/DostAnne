/**
 * AppHeader Component
 * Top navigation bar with logo, title, and action icons
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppHeaderProps {
  title: string;
  showNotification?: boolean;
  showSettings?: boolean;
  onNotificationPress?: () => void;
  onSettingsPress?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showNotification = true,
  showSettings = true,
  onNotificationPress,
  onSettingsPress,
}) => {
  const { colors, typography, shadows } = useThemedStyles();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background.light,
          paddingTop: insets.top > 0 ? insets.top : 12,
          borderBottomColor: colors.neutral[200],
        },
        shadows.sm,
      ]}
    >
      <View style={styles.content}>
        {/* Left: Logo */}
        <View style={styles.logoContainer}>
          <View
            style={[
              styles.logo,
              {
                backgroundColor: colors.brand.green[50],
                borderColor: colors.brand.green[200],
              },
            ]}
          >
            <Ionicons name="leaf" size={24} color={colors.brand.green[600]} />
          </View>
        </View>

        {/* Center: Title */}
        <Text
          style={[
            styles.title,
            typography.h4,
            { color: colors.text.primary },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>

        {/* Right: Action Icons */}
        <View style={styles.actionsContainer}>
          {showNotification && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onNotificationPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          )}
          {showSettings && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onSettingsPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name="settings-outline"
                size={24}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  logoContainer: {
    width: 40,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
    justifyContent: 'flex-end',
  },
  iconButton: {
    padding: 4,
  },
});
