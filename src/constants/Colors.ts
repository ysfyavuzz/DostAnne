/**
 * DostAnne Design System - Colors
 * Modern, accessible color palette
 */

export const Colors = {
  // Primary Brand Colors (Dreamy Green)
  primary: {
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

  // Secondary Colors (Soft Peach/Orange)
  secondary: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },

  // Accent Colors (Magical Purple)
  accent: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA',
    700: '#7E22CE',
    800: '#6B21A8',
    900: '#581C87',
  },

  // Success
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
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
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  // Semantic Colors
  background: {
    light: '#F8FAFC', // Very light blue-ish gray for freshness
    dark: '#0F172A',
    card: '#FFFFFF',
    cardDark: '#1E293B',
    soft: '#F0FDF4',
    softDark: '#134E4A',
    glass: 'rgba(255, 255, 255, 0.7)',
    glassDark: 'rgba(30, 41, 59, 0.7)',
  },

  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    tertiary: '#94A3B8',
    inverse: '#FFFFFF',
    disabled: '#CBD5E1',
  },

  // Activity Type Colors
  activity: {
    feeding: '#F97316', // Orange
    sleep: '#8B5CF6', // Purple
    diaper: '#10B981', // Emerald
    health: '#EF4444', // Red
    play: '#F59E0B', // Amber
    milestone: '#EC4899', // Pink
    bath: '#06B6D4', // Cyan
  },

  // Brand Colors (Legacy support)
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
  },

  // Modern Gradients
  gradients: {
    primary: ['#4ADE80', '#22C55E'], // Fresh Green
    secondary: ['#FB923C', '#F97316'], // Warm Orange
    success: ['#34D399', '#10B981'],
    danger: ['#F87171', '#EF4444'],
    info: ['#60A5FA', '#3B82F6'],
    
    // Special Gradients
    aurora: ['#86EFAC', '#3B82F6', '#9333EA'], // Green -> Blue -> Purple
    sunset: ['#FCD34D', '#F97316', '#EF4444'], // Yellow -> Orange -> Red
    ocean: ['#22D3EE', '#3B82F6', '#1E40AF'], // Cyan -> Blue -> Dark Blue
    dream: ['#F0ABFC', '#A855F7', '#6366F1'], // Pink -> Purple -> Indigo
    
    // Activity Gradients
    sleep: ['#A78BFA', '#7C3AED'],
    feeding: ['#FDBA74', '#EA580C'],
    diaper: ['#6EE7B7', '#059669'],
    purple: ['#C084FC', '#9333EA'],
    pink: ['#F472B6', '#DB2777'],
    green: ['#4ADE80', '#16A34A'],
    blue: ['#60A5FA', '#2563EB'],
  },
} as const;

export const DarkColors = {
  ...Colors,
  background: {
    light: '#0F172A',
    dark: '#020617',
    card: '#1E293B',
    cardDark: '#0F172A',
    soft: '#1E293B',
    softDark: '#020617',
    glass: 'rgba(30, 41, 59, 0.7)',
    glassDark: 'rgba(15, 23, 42, 0.8)',
  },
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    tertiary: '#64748B',
    inverse: '#0F172A',
    disabled: '#475569',
  },
} as const;

export type ColorScheme = 'light' | 'dark';
