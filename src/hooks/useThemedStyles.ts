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
    
    // Create a merged object with both flat and nested properties
    const merged: any = {
      ...baseColors, // Full color palette with nested structures
      // Override specific flat properties from theme
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
    merged.text = Object.assign(
      {
        primary: themeColors.text,
        secondary: themeColors.textSecondary,
        tertiary: baseColors.text.tertiary,
        inverse: baseColors.text.inverse,
        disabled: baseColors.text.disabled,
        toString: () => themeColors.text,
        valueOf: () => themeColors.text,
      },
      { _flat: themeColors.text }
    );
    
    merged.background = Object.assign(
      {
        light: baseColors.background.light,
        dark: baseColors.background.dark,
        card: baseColors.background.card,
        cardDark: baseColors.background.cardDark,
        soft: baseColors.background.soft,
        softDark: baseColors.background.softDark,
        toString: () => themeColors.background,
        valueOf: () => themeColors.background,
      },
      { _flat: themeColors.background }
    );
    
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

// Type-safe theme context
export type ThemedStyles = ReturnType<typeof useThemedStyles>;
