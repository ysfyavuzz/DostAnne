import React, { useState, useEffect, createContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'light' | 'dark' | 'auto';
export type AccentColor = 'blue' | 'green' | 'purple' | 'pink' | 'orange';

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

const lightColors = {
  primary: '#4A90E2',
  secondary: '#5AC8FA',
  background: '#FFFFFF',
  card: '#FFFFFF',
  text: '#000000',
  textSecondary: '#666666',
  border: '#E9ECEF',
  success: '#4ECDC4',
  warning: '#FFA500',
  error: '#FF6B6B',
  info: '#4A90E2',
  tabBar: '#FFFFFF',
  tabBarActive: '#4A90E2',
  header: '#4A90E2',
};

const darkColors = {
  primary: '#5AC8FA',
  secondary: '#4A90E2',
  background: '#1C1C1E',
  card: '#2C2C2E',
  text: '#FFFFFF',
  textSecondary: '#98989F',
  border: '#38383A',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#5AC8FA',
  tabBar: '#2C2C2E',
  tabBarActive: '#5AC8FA',
  header: '#2C2C2E',
};

const accentColors: Record<AccentColor, { light: string; dark: string }> = {
  blue: { light: '#4A90E2', dark: '#5AC8FA' },
  green: { light: '#34C759', dark: '#30D158' },
  purple: { light: '#AF52DE', dark: '#BF5AF2' },
  pink: { light: '#FF2D92', dark: '#FF2D92' },
  orange: { light: '#FF9500', dark: '#FF9F0A' },
};

export function useTheme() {
  const deviceColorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>('auto');
  const [accentColor, setAccentColor] = useState<AccentColor>('blue');

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
        header: isDark ? '#2C2C2E' : accent,
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