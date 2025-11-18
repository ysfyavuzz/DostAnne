/**
 * Enhanced Theme Hook with Design System
 */

import { useColorScheme } from 'react-native';
import { Colors, DarkColors, ColorScheme } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing, BorderRadius, Shadows } from '../constants/Spacing';
import { useMemo } from 'react';

export const useThemedStyles = () => {
  const systemColorScheme = useColorScheme() as ColorScheme;
  const isDark = systemColorScheme === 'dark';

  const colors = useMemo(() => isDark ? DarkColors : Colors, [isDark]);

  return {
    colors,
    typography: Typography,
    spacing: Spacing,
    borderRadius: BorderRadius,
    shadows: Shadows,
    isDark,
    colorScheme: systemColorScheme,
  };
};

// Type-safe theme context
export type ThemedStyles = ReturnType<typeof useThemedStyles>;
