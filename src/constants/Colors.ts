/**
 * DostAnne Design System - Colors
 * Modern, accessible color palette
 */

export const Colors = {
  // Primary Brand Colors (Logo'dan gelen yeşil ve turuncu tonları)
  primary: {
    50: '#F7FCEF', // Açık Yeşil
    100: '#EAF5D8',
    200: '#D4E8B0',
    300: '#BBD987',
    400: '#9FC95F', // Ana Yeşil
    500: '#86B83C',
    600: '#6A912F',
    700: '#4F6B23',
    800: '#354618',
    900: '#1C240C',
  },

  // Secondary Colors (Logo'dan gelen turuncu/şeftali tonları)
  secondary: {
    50: '#FFF8F0', // Açık Turuncu
    100: '#FFEEDD',
    200: '#FFD9B3',
    300: '#FFC08A',
    400: '#FF9E5C',
    500: '#FF7B2E', // Ana Turuncu
    600: '#E66929',
    700: '#BF5722',
    800: '#99461C',
    900: '#733415',
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
    // Yeni eklenen renkler
    soft: '#F7FCEF', // Çok açık yeşil
    softDark: '#1C240C', // Çok koyu yeşil
  },

  text: {
    primary: '#1C240C', // Koyu yeşil
    secondary: '#4F6B23', // Orta yeşil
    tertiary: '#9FC95F', // Açık yeşil
    inverse: '#FFFFFF',
    disabled: '#D1D5DB',
  },

  // Activity Type Colors (Yeni palete göre güncellendi)
  activity: {
    feeding: '#FF7B2E', // Turuncu
    sleep: '#4A90E2', // Mavi
    diaper: '#9FC95F', // Yeşil
    health: '#EF4444', // Kırmızı
    play: '#FFC08A', // Açık Turuncu
    milestone: '#8B5CF6', // Mor
  },

  // DostAnne Brand Colors (Logo'dan gelen ana renkler)
  brand: {
    green: {
      50: '#F7FCEF',
      100: '#EAF5D8',
      200: '#D4E8B0',
      300: '#BBD987',
      400: '#9FC95F',
      500: '#86B83C',
      600: '#6A912F',
      700: '#4F6B23',
    },
    orange: {
      50: '#FFF8F0',
      100: '#FFEEDD',
      200: '#FFD9B3',
      300: '#FFC08A',
      400: '#FF9E5C',
      500: '#FF7B2E',
      600: '#E66929',
      700: '#BF5722',
    },
  },

  // Gradient Presets (Yeni palete göre güncellendi)
  gradients: {
    primary: ['#9FC95F', '#86B83C'], // Yeşil Gradient
    secondary: ['#FF7B2E', '#E66929'], // Turuncu Gradient
    success: ['#86B83C', '#6A912F'],
    danger: ['#EF4444', '#DC2626'],
    info: ['#4A90E2', '#3B82F6'],
    sleep: ['#4A90E2', '#3B82F6'],
    feeding: ['#FF7B2E', '#E66929'],
    diaper: ['#9FC95F', '#86B83C'],
  },
} as const;

export const DarkColors = {
  ...Colors,
  background: {
    light: '#111827', // Koyu arka plan
    dark: '#000000', // En koyu arka plan
    card: '#1F2937', // Kart arka planı
    cardDark: '#111827',
    soft: '#1F2937', // Yumuşak koyu
    softDark: '#111827',
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
