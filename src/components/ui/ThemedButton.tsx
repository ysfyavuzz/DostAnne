import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, Animated, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemedStyles } from '../../hooks/useThemedStyles';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'success' | 'danger' | 'glass';
type ButtonSize = 'small' | 'medium' | 'large';

interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}) => {
  const { colors, typography, spacing, borderRadius, shadows } = useThemedStyles();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isGradientVariant = variant === 'primary' || variant === 'success' || variant === 'danger';
  const isDisabled = disabled || loading;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return colors.gradients.primary;
      case 'success':
        return colors.gradients.success;
      case 'danger':
        return colors.gradients.danger;
      default:
        return colors.gradients.primary;
    }
  };

  const getTextColor = () => {
    if (isDisabled) return colors.text.disabled;
    if (variant === 'text') return colors.text.primary;
    if (variant === 'outline') return colors.text.primary;
    if (variant === 'secondary') return colors.text.primary;
    if (variant === 'glass') return colors.text.primary;
    return 'white';
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 24;
      default: return 20;
    }
  };

  const styles = createStyles(colors, typography, spacing, borderRadius, shadows, variant, size, fullWidth, isDisabled);

  const content = (
    <>
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={getIconSize()} color={getTextColor()} style={styles.iconLeft} />
          )}
          <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={getIconSize()} color={getTextColor()} style={styles.iconRight} />
          )}
        </>
      )}
    </>
  );

  const ButtonContainer = ({ children }: { children: React.ReactNode }) => (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, fullWidth && { width: '100%' }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        style={[styles.buttonWrapper, style]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );

  if (isGradientVariant && !isDisabled) {
    return (
      <ButtonContainer>
        <LinearGradient
          colors={getGradientColors() as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          {content}
        </LinearGradient>
      </ButtonContainer>
    );
  }

  return (
    <ButtonContainer>
      <View style={[styles.button, style]}>
        {content}
      </View>
    </ButtonContainer>
  );
};

const createStyles = (
  colors: any,
  typography: any,
  spacing: any,
  borderRadius: any,
  shadows: any,
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  disabled: boolean
) => StyleSheet.create({
  buttonWrapper: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    width: fullWidth ? '100%' : 'auto',
    ...(!disabled && variant !== 'text' && variant !== 'glass' && shadows.md),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: size === 'small' ? spacing.md : size === 'large' ? spacing['2xl'] : spacing.lg,
    paddingVertical: size === 'small' ? spacing.sm : size === 'large' ? spacing.lg : spacing.md,
    borderRadius: borderRadius.xl,
    ...(variant === 'outline' && {
      borderWidth: 2,
      borderColor: disabled ? colors.neutral[300] : colors.primary[500],
      backgroundColor: 'transparent',
    }),
    ...(variant === 'secondary' && {
      backgroundColor: disabled ? colors.neutral[200] : colors.secondary[100],
    }),
    ...(variant === 'text' && {
      backgroundColor: 'transparent',
      paddingHorizontal: spacing.sm,
    }),
    ...(variant === 'glass' && {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    }),
    ...(disabled && variant !== 'outline' && variant !== 'text' && {
      backgroundColor: colors.neutral[200],
    }),
  },
  text: {
    ...(size === 'small' ? typography.buttonSmall : size === 'large' ? typography.buttonLarge : typography.button),
    fontWeight: '600',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
});
