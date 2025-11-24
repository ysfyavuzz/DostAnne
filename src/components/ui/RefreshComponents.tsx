import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { PullToRefreshIndicator } from './LoadingComponents';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

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
        // @ts-ignore - _value is internal but needed for offset
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
    <View style={styles.swipeableContainer}>
      <Animated.View
        style={[
          styles.swipeableContent,
          { transform: [{ translateX }] },
        ]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
      {(onEdit || onDelete) && (
        <View style={styles.swipeActions}>
          {onEdit && (
            <View style={[styles.actionButton, styles.editButton]}>
              <Text style={styles.actionText}>✏️</Text>
            </View>
          )}
          {onDelete && (
            <View style={[styles.actionButton, styles.deleteButton]}>
              <Text style={styles.actionText}>🗑️</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  swipeableContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  swipeableContent: {
    backgroundColor: 'white',
  },
  swipeActions: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: '#E74C3C',
  },
  actionText: {
    fontSize: 24,
  },
});
