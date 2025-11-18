import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/src/hooks/useTheme';
import { createText } from '@/src/components/ThemedText';

const ThemedText = createText();
const { width: screenWidth } = Dimensions.get('window');

interface ShimmerProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const Shimmer: React.FC<ShimmerProps> = ({
  width = screenWidth - 40,
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();
    return () => shimmerAnimation.stop();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View
      style={[
        {
          width,
          height,
          backgroundColor: '#f0f0f0',
          borderRadius,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          width: width * 2,
          height,
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </Animated.View>
    </View>
  );
};

interface CardShimmerProps {
  showAvatar?: boolean;
  lines?: number;
}

export const CardShimmer: React.FC<CardShimmerProps> = ({
  showAvatar = true,
  lines = 3,
}) => {
  return (
    <View style={styles.cardShimmer}>
      {showAvatar && (
        <Shimmer
          width={50}
          height={50}
          borderRadius={25}
          style={styles.avatarShimmer}
        />
      )}
      <View style={styles.cardShimmerContent}>
        <Shimmer width={120} height={16} style={styles.titleShimmer} />
        {[...Array(lines)].map((_, index) => (
          <Shimmer
            key={index}
            width={index === lines - 1 ? 180 : screenWidth - 120}
            height={12}
            style={styles.lineShimmer}
          />
        ))}
      </View>
    </View>
  );
};

interface StatsCardShimmerProps {
  cards?: number;
}

export const StatsCardShimmer: React.FC<StatsCardShimmerProps> = ({
  cards = 3,
}) => {
  return (
    <View style={styles.statsContainer}>
      {[...Array(cards)].map((_, index) => (
        <View key={index} style={styles.statCard}>
          <Shimmer width={30} height={30} borderRadius={15} />
          <Shimmer width={40} height={20} />
          <Shimmer width={60} height={12} />
        </View>
      ))}
    </View>
  );
};

interface ChartShimmerProps {
  height?: number;
}

export const ChartShimmer: React.FC<ChartShimmerProps> = ({ height = 200 }) => {
  return (
    <View style={[styles.chartShimmer, { height }]}>
      <Shimmer width={150} height={16} style={styles.chartTitleShimmer} />
      <View style={styles.chartContent}>
        <Shimmer width={screenWidth - 80} height={height - 50} />
      </View>
    </View>
  );
};

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Yükleniyor...',
}) => {
  const { colors } = useTheme();

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={[styles.loadingCard, { backgroundColor: colors.card }]}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <ThemedText style={styles.loadingText}>{message}</ThemedText>
      </View>
    </View>
  );
};

interface PullToRefreshIndicatorProps {
  refreshing: boolean;
  progress: number;
}

export const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  refreshing,
  progress,
}) => {
  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.refreshIndicator}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <ActivityIndicator
          size="small"
          color={refreshing ? '#4A90E2' : '#ccc'}
        />
      </Animated.View>
      <ThemedText style={styles.refreshText}>
        {refreshing ? 'Yenileniyor...' : 'Yenilemek için çekin'}
      </ThemedText>
    </View>
  );
};

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
      <Text style={styles.emptyIcon}>{icon}</Text>
      <ThemedText style={styles.emptyTitle}>{title}</ThemedText>
      <ThemedText style={styles.emptySubtitle}>{subtitle}</ThemedText>
      {actionLabel && onAction && (
        <TouchableOpacity
          style={[styles.emptyActionButton, { backgroundColor: colors.primary }]}
          onPress={onAction}
        >
          <ThemedText style={styles.emptyActionText}>{actionLabel}</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
};

interface ErrorStateProps {
  title: string;
  subtitle: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  subtitle,
  retryLabel = 'Tekrar Dene',
  onRetry,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.errorState, { backgroundColor: colors.card }]}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <ThemedText style={styles.errorTitle}>{title}</ThemedText>
      <ThemedText style={styles.errorSubtitle}>{subtitle}</ThemedText>
      {onRetry && (
        <TouchableOpacity
          style={[styles.errorActionButton, { backgroundColor: colors.primary }]}
          onPress={onRetry}
        >
          <ThemedText style={styles.errorActionText}>{retryLabel}</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardShimmer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
  },
  avatarShimmer: {
    marginRight: 15,
  },
  cardShimmerContent: {
    flex: 1,
  },
  titleShimmer: {
    marginBottom: 8,
  },
  lineShimmer: {
    marginBottom: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  chartShimmer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
  },
  chartTitleShimmer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  chartContent: {
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingCard: {
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
  },
  refreshIndicator: {
    alignItems: 'center',
    padding: 20,
  },
  refreshText: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 8,
  },
  emptyState: {
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    margin: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyActionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  emptyActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  errorState: {
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    margin: 20,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorActionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  errorActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});