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
  const { colors: themeColors, isDark, colorScheme } = useTheme(); // useTheme'dan dinamik renkleri al

  // useTheme'dan gelen dinamik renkleri ve statik sabitleri birleştir
  const colors = useMemo(() => ({
    ...themeColors,
    ...Colors, // Statik renk paletini de ekle
    ...DarkColors, // Dark renk paletini de ekle
  }), [themeColors]);

  return {
    colors,
    typography: Typography,
    spacing: Spacing,
    borderRadius: BorderRadius,
    shadows: Shadows,
    isDark,
    colorScheme,
  };
};

// Type-safe theme context
export type ThemedStyles = ReturnType<typeof useThemedStyles>;
