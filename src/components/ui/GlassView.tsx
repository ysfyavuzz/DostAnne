import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useThemedStyles } from '../../hooks/useThemedStyles';

interface GlassViewProps {
    children: React.ReactNode;
    style?: ViewStyle;
    intensity?: number;
    tint?: 'light' | 'dark' | 'default';
    borderless?: boolean;
}

export const GlassView: React.FC<GlassViewProps> = ({
    children,
    style,
    intensity = 20,
    tint,
    borderless = false,
}) => {
    const { isDark, colors, borderRadius } = useThemedStyles();

    const containerStyle: ViewStyle = {
        backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.6)',
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        borderWidth: borderless ? 0 : 1,
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.4)',
        ...style,
    };

    if (Platform.OS === 'android') {
        // Android doesn't support BlurView well in all cases, use translucent background
        return (
            <View style={containerStyle}>
                {children}
            </View>
        );
    }

    return (
        <BlurView
            intensity={intensity}
            tint={tint || (isDark ? 'dark' : 'light')}
            style={containerStyle}
        >
            {children}
        </BlurView>
    );
};
