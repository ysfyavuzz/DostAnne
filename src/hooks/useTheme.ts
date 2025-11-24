import React, { useState, useEffect, createContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'light' | 'dark' | 'auto';
export type AccentColor = 'primary' | 'secondary' | 'blue' | 'purple' | 'pink' | 'green' | 'orange';

export interface Theme {
  type: ThemeType;
  accent: AccentColor;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    tabBar: string;
    tabBarActive: string;
    header: string;
  };
}

import { Colors, DarkColors } from '../constants/Colors';

const lightColors = {
  primary: Colors.primary[500],
  secondary: Colors.secondary[500],
  background: Colors.background.light,
  card: Colors.background.card,
  text: Colors.text.primary,
  textSecondary: Colors.text.secondary,
  border: Colors.neutral[200],
  success: Colors.success[500],
  warning: Colors.warning[500],
  error: Colors.error[500],
  info: Colors.secondary[500],
  tabBar: Colors.background.card,
  tabBarActive: Colors.primary[500],
  header: Colors.primary[500],
};

const darkColors = {
  primary: DarkColors.primary[500],
  secondary: DarkColors.secondary[500],
  background: DarkColors.background.light,
  card: DarkColors.background.card,
  text: DarkColors.text.primary,
  textSecondary: DarkColors.text.secondary,
  border: DarkColors.neutral[700],
  success: DarkColors.success[500],
  warning: DarkColors.warning[500],
  error: DarkColors.error[500],
  info: DarkColors.secondary[500],
  tabBar: DarkColors.background.card,
  tabBarActive: DarkColors.primary[500],
  header: DarkColors.primary[500],
};

const accentColors: Record<AccentColor, { light: string; dark: string }> = {
  primary: { light: Colors.primary[500], dark: DarkColors.primary[500] },
  secondary: { light: Colors.secondary[500], dark: DarkColors.secondary[500] },
  blue: { light: '#4A90E2', dark: '#5AC8FA' },
  purple: { light: '#AF52DE', dark: '#BF5AF2' },
  pink: { light: '#FF2D92', dark: '#FF2D92' },
};

export function useTheme() {
  const deviceColorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>('auto');
  const [accentColor, setAccentColor] = useState<AccentColor>('primary');

  useEffect(() => {
    loadThemeSettings();
  }, []);

  const loadThemeSettings = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme_type');
      const savedAccent = await AsyncStorage.getItem('accent_color');
      
      if (savedTheme) {
        setThemeType(savedTheme as ThemeType);
      }
      if (savedAccent) {
        setAccentColor(savedAccent as AccentColor);
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    }
  };

  const saveThemeSettings = async (type: ThemeType, accent: AccentColor) => {
    try {
      await AsyncStorage.setItem('theme_type', type);
      await AsyncStorage.setItem('accent_color', accent);
    } catch (error) {
      console.error('Error saving theme settings:', error);
    }
  };

  const updateTheme = (type: ThemeType) => {
    setThemeType(type);
    saveThemeSettings(type, accentColor);
  };

  const updateAccent = (accent: AccentColor) => {
    setAccentColor(accent);
    saveThemeSettings(themeType, accent);
  };

  const getCurrentTheme = (): Theme => {
    const isDark = themeType === 'auto' 
      ? deviceColorScheme === 'dark' 
      : themeType === 'dark';

    const baseColors = isDark ? darkColors : lightColors;
    const accent = accentColors[accentColor][isDark ? 'dark' : 'light'];

    return {
      type: themeType,
      accent: accentColor,
      colors: {
        ...baseColors,
        primary: accent,
        tabBarActive: accent,
        header: isDark ? baseColors.card : accent,
      },
    };
  };

  const theme = getCurrentTheme();

  return {
    theme,
    colors: theme.colors,
    themeType,
    accentColor,
    updateTheme,
    updateAccent,
    isDark: deviceColorScheme === 'dark' && themeType === 'auto',
    isSystemDark: deviceColorScheme === 'dark',
  };
}

export interface ThemeContextType {
  theme: Theme;
  updateTheme: (type: ThemeType) => void;
  updateAccent: (accent: AccentColor) => void;
}

export const ThemeContext = React.createContext<ThemeContextType | null>(null);