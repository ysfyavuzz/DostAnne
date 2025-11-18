import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { PullToRefreshIndicator } from './LoadingComponents';

const { height: screenHeight } = Dimensions.get('window');

interface RefreshableScrollViewProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  refreshing: boolean;
  style?: any;
}

export const RefreshableScrollView: React.FC<RefreshableScrollViewProps> = ({
  children,
  onRefresh,
  refreshing,
  style,
}) => {
  const { colors } = useTheme();
  const [pullDistance, setPullDistance] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={style}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
};

interface SwipeableCardProps {
  children: React.ReactNode;
  onDelete?: () => void;
  onEdit?: () => void;
  deleteThreshold?: number;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onDelete,
  onEdit,
  deleteThreshold = 100,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderGrant: () => {
        translateX.setOffset(translateX._value);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        translateX.flattenOffset();
        
        if (gestureState.dx < -deleteThreshold) {
          if (onDelete) {
            onDelete();
          }
          Animated.spring(translateX, {
            toValue: -screenWidth,
            useNativeDriver: true,
          }).start();
        } else if (gestureState.dx < -50 && onEdit) {
          onEdit();
          Animated.spring(translateX, {
            toValue: -80,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.swipeContainer}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
      
      <View style={styles.actions}>
        {onEdit && (
          <View style={[styles.actionButton, styles.editButton]}>
          </View>
        )}
        {onDelete && (
          <View style={[styles.actionButton, styles.deleteButton]}>
          </View>
        )}
      </View>
    </View>
  );
};

interface ScreenTransitionProps {
  children: React.ReactNode;
  animationType?: 'slide' | 'fade' | 'scale';
}

export const ScreenTransition: React.FC<ScreenTransitionProps> = ({
  children,
  animationType = 'slide',
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    let animation: Animated.CompositeAnimation;

    switch (animationType) {
      case 'slide':
        animation = Animated.timing(animatedValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        });
        break;
      case 'fade':
        animation = Animated.timing(animatedValue, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        });
        break;
      case 'scale':
        animation = Animated.spring(animatedValue, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        });
        break;
      default:
        animation = Animated.timing(animatedValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        });
    }

    animation.start();
    return () => animation.stop();
  }, [animationType]);

  const getAnimationStyle = () => {
    switch (animationType) {
      case 'slide':
        return {
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
          opacity: animatedValue,
        };
      case 'fade':
        return {
          opacity: animatedValue,
        };
      case 'scale':
        return {
          transform: [
            {
              scale: animatedValue,
            },
          ],
        };
      default:
        return {
          opacity: animatedValue,
        };
    }
  };

  return (
    <Animated.View style={[styles.transitionContainer, getAnimationStyle()]}>
      {children}
    </Animated.View>
  );
};

interface FloatingButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  visible?: boolean;
  position?: 'bottomRight' | 'bottomLeft' | 'bottomCenter';
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  onPress,
  icon,
  visible = true,
  position = 'bottomRight',
}) => {
  const scale = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scale, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const getPositionStyle = () => {
    switch (position) {
      case 'bottomRight':
        return styles.bottomRight;
      case 'bottomLeft':
        return styles.bottomLeft;
      case 'bottomCenter':
        return styles.bottomCenter;
      default:
        return styles.bottomRight;
    }
  };

  return (
    <Animated.View
      style={[
        styles.floatingButton,
        getPositionStyle(),
        {
          transform: [{ scale }],
        },
      ]}
    >
      <Animated.View
        style={styles.fabBackground}
        onStartShouldSetResponder={() => true}
        onResponderRelease={onPress}
      >
        {icon}
      </Animated.View>
    </Animated.View>
  );
};

interface PulseAnimationProps {
  children: React.ReactNode;
  pulse?: boolean;
}

export const PulseAnimation: React.FC<PulseAnimationProps> = ({
  children,
  pulse = true,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (pulse) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [pulse]);

  return (
    <Animated.View
      style={[
        styles.pulseContainer,
        {
          transform: [{ scale }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  swipeContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 2,
  },
  actions: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 1,
  },
  actionButton: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4A90E2',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
  },
  transitionContainer: {
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    zIndex: 1000,
  },
  bottomRight: {
    bottom: 30,
    right: 30,
  },
  bottomLeft: {
    bottom: 30,
    left: 30,
  },
  bottomCenter: {
    bottom: 30,
    left: '50%',
    marginLeft: -28,
  },
  fabBackground: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pulseContainer: {
    flex: 1,
  },
});