/**
 * Enhanced Theme Hook with Design System
 */

import { useColorScheme } from 'react-native';
import { Colors, DarkColors, ColorScheme } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing, BorderRadius, Shadows } from '../constants/Spacing';
import { useMemo } from 'react';
import { useTheme } from './useTheme'; // Yeni useTheme hook'unu import et

export const useThemedStyles = () => {
  const { colors: themeColors, isDark, theme } = useTheme(); // useTheme'dan dinamik renkleri al
  const systemColorScheme = useColorScheme();

  // useTheme'dan gelen dinamik renkleri ve statik sabitleri birleştir
  const colors = useMemo(() => {
    const baseColors = isDark ? DarkColors : Colors;
    return {
      ...baseColors, // Full color palette with nested structures
      // Override specific flat properties from theme
      primary: themeColors.primary,
      secondary: themeColors.secondary,
      background: themeColors.background,
      card: themeColors.card,
      text: themeColors.text, // Flat text property
      textSecondary: themeColors.textSecondary,
      border: themeColors.border,
      success: themeColors.success,
      warning: themeColors.warning,
      error: themeColors.error,
      info: themeColors.info,
      tabBar: themeColors.tabBar,
      tabBarActive: themeColors.tabBarActive,
      header: themeColors.header,
      // Manually add nested text object for components that use it
      text: {
        primary: themeColors.text,
        secondary: themeColors.textSecondary,
        tertiary: baseColors.text.tertiary,
        inverse: baseColors.text.inverse,
        disabled: baseColors.text.disabled,
      } as any, // Type assertion to allow both string and object access
    };
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

// Type-safe theme context
export type ThemedStyles = ReturnType<typeof useThemedStyles>;
