/**
 * DostAnne Design System - Colors
 * Modern, accessible color palette
 */

export const Colors = {
  // Primary Brand Colors
  primary: {
    50: '#FFF0F5',
    100: '#FFE0EC',
    200: '#FFC9DD',
    300: '#FFA3C7',
    400: '#FF6B9D',
    500: '#FF4785',
    600: '#E63670',
    700: '#C22960',
    800: '#9F1F52',
    900: '#7A1840',
  },

  // Secondary Colors
  secondary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // Success
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  // Warning
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Error
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Neutral/Gray
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Semantic Colors
  background: {
    light: '#FFFFFF',
    dark: '#0F172A',
    card: '#FFFFFF',
    cardDark: '#1E293B',
  },

  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
    disabled: '#D1D5DB',
  },

  // Activity Type Colors
  activity: {
    feeding: '#FF6B9D',
    sleep: '#8B5CF6',
    diaper: '#10B981',
    health: '#EF4444',
    play: '#F59E0B',
    milestone: '#3B82F6',
  },

  // DostAnne Brand Colors
  brand: {
    green: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E',
      600: '#16A34A',
      700: '#15803D',
    },
    orange: {
      50: '#FFF7ED',
      100: '#FFEDD5',
      200: '#FED7AA',
      300: '#FDBA74',
      400: '#FB923C',
      500: '#F97316',
      600: '#EA580C',
      700: '#C2410C',
    },
    pink: {
      50: '#FFF0F5',
      100: '#FFE0EC',
      200: '#FFC9DD',
      300: '#FFA3C7',
      400: '#FF6B9D',
      500: '#FF4785',
      600: '#E63670',
      700: '#C22960',
    },
  },

  // Gradient Presets
  gradients: {
    primary: ['#FF6B9D', '#FF4785'],
    secondary: ['#3B82F6', '#2563EB'],
    success: ['#10B981', '#059669'],
    sunset: ['#F59E0B', '#EF4444'],
    ocean: ['#06B6D4', '#3B82F6'],
    purple: ['#A855F7', '#8B5CF6'],
    pink: ['#FF6B9D', '#FF4785'],
    orange: ['#F97316', '#EA580C'],
    green: ['#22C55E', '#16A34A'],
  },
} as const;

export const DarkColors = {
  ...Colors,
  background: {
    light: '#0F172A',
    dark: '#020617',
    card: '#1E293B',
    cardDark: '#0F172A',
  },
  text: {
    primary: '#F9FAFB',
    secondary: '#D1D5DB',
    tertiary: '#9CA3AF',
    inverse: '#111827',
    disabled: '#4B5563',
  },
} as const;

export type ColorScheme = 'light' | 'dark';
