/**
 * Enhanced Theme Hook with Design System
 */

import { useColorScheme } from 'react-native';
import { Colors, DarkColors, ColorScheme } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing, BorderRadius, Shadows } from '../constants/Spacing';
import { useMemo } from 'react';
import { useTheme } from './useTheme'; // Yeni useTheme hook'unu import et

// Type definitions for the merged colors object
// We define this manually to allow string overrides for literal types defined in Colors
export type ThemeColors = {
  primary: string | typeof Colors.primary;
  secondary: string | typeof Colors.secondary;
  border: string;
  success: string | typeof Colors.success;
  warning: string | typeof Colors.warning;
  error: string | typeof Colors.error;
  info: string;
  tabBar: string;
  tabBarActive: string;
  header: string;
  textSecondary: string;
  // Use intersection to keep nested properties while allowing string override
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    disabled: string;
    toString: () => string;
    valueOf: () => string;
    _flat: string;
  };
  background: {
    light: string;
    dark: string;
    card: string;
    cardDark: string;
    soft: string;
    softDark: string;
    glass: string;
    glassDark: string;
    toString: () => string;
    valueOf: () => string;
    _flat: string;
  };
  card: string;
} & Omit<typeof Colors, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'text' | 'background'>;

export const useThemedStyles = () => {
  const { colors: themeColors, isDark, theme } = useTheme();
  const systemColorScheme = useColorScheme();

  const colors = useMemo(() => {
    const baseColors = isDark ? DarkColors : Colors;

    // Create a merged object with both flat and nested properties
    // We cast to any here because we are overriding some object properties (like primary) with strings
    // which causes type conflicts with the base Colors type
    const merged: any = {
      ...baseColors,
      primary: themeColors.primary,
      secondary: themeColors.secondary,
      border: themeColors.border,
      success: themeColors.success,
      warning: themeColors.warning,
      error: themeColors.error,
      info: themeColors.info,
      tabBar: themeColors.tabBar,
      tabBarActive: themeColors.tabBarActive,
      header: themeColors.header,
      textSecondary: themeColors.textSecondary,
    };

    // Add hybrid properties that need both flat and nested access
    // Using Object.assign to add toString to the object for string coercion
    const textWithToString = Object.assign(
      {
        ...baseColors.text,
        primary: themeColors.text,
        secondary: themeColors.textSecondary,
        toString: () => themeColors.text,
        valueOf: () => themeColors.text,
      },
      { _flat: themeColors.text }
    );

    const backgroundWithToString = Object.assign(
      {
        ...baseColors.background,
        toString: () => themeColors.background,
        valueOf: () => themeColors.background,
      },
      { _flat: themeColors.background }
    );

    merged.text = textWithToString;
    merged.background = backgroundWithToString;
    merged.card = themeColors.card;

    return merged;
  }, [themeColors, isDark]);

  return {
    colors,
    typography: Typography,
    spacing: Spacing,
    borderRadius: BorderRadius,
    shadows: Shadows,
    isDark,
    colorScheme: (theme.type === 'auto' ? systemColorScheme : theme.type) as ColorScheme,
  };
};

export type ThemedStyles = ReturnType<typeof useThemedStyles>;

