/**
 * DostAnne Design System - Spacing
 * Consistent spacing and sizing
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

export const IconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
  '2xl': 48,
} as const;

// Base shadow definitions
const createShadow = (offsetHeight: number, opacity: number, radius: number, elevation: number) => ({
  shadowColor: '#000',
  shadowOffset: { width: 0, height: offsetHeight },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation,
});

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: createShadow(1, 0.05, 2, 2),
  md: createShadow(2, 0.1, 4, 4),
  lg: createShadow(4, 0.15, 8, 8),
  xl: createShadow(8, 0.2, 16, 12),
  // Aliases for convenience (reuse existing objects instead of duplicating)
  get small() { return this.sm; },
  get medium() { return this.md; },
  get large() { return this.lg; },
} as const;

export const Layout = {
  screen: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  section: {
    marginBottom: Spacing['2xl'],
  },
} as const;
