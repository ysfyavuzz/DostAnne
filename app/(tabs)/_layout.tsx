import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { Colors } from '../../src/constants/Colors';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.brand.green[600],
        tabBarInactiveTintColor: Colors.neutral[400],
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: Colors.neutral[200],
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          height: 60 + (insets.bottom > 0 ? insets.bottom : 8),
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: Colors.brand.green[600],
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      }}
    >
      {/* Main Tab - Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={size} 
              color={color} 
            />
          ),
          headerShown: false,
        }}
      />

      {/* Tracking Tab - Consolidated tracking features */}
      <Tabs.Screen
        name="activities"
        options={{
          title: 'Takip',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'pulse' : 'pulse-outline'} 
              size={size} 
              color={color} 
            />
          ),
          headerTitle: 'Takip',
          headerShown: false,
        }}
      />

      {/* Q&A Tab - MotherWorld */}
      <Tabs.Screen
        name="mother-world"
        options={{
          title: 'Soru & Cevap',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'} 
              size={size} 
              color={color} 
            />
          ),
          headerShown: false,
        }}
      />

      {/* Statistics Tab */}
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'İstatistikler',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'bar-chart' : 'bar-chart-outline'} 
              size={size} 
              color={color} 
            />
          ),
          headerTitle: 'İstatistikler',
          headerShown: false,
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'person' : 'person-outline'} 
              size={size} 
              color={color} 
            />
          ),
          headerTitle: 'Profil',
          headerShown: false,
        }}
      />

      {/* Hidden tabs - accessible but not shown in tab bar */}
      <Tabs.Screen
        name="feeding"
        options={{
          href: null,
          headerTitle: 'Emzirme',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="sleep"
        options={{
          href: null,
          headerTitle: 'Uyku Takibi',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="development"
        options={{
          href: null,
          headerTitle: 'Gelişim',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          href: null,
          headerTitle: 'Acil Durumlar',
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          href: null,
          headerTitle: 'Sağlık',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          href: null,
          headerTitle: 'Beslenme',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          href: null,
          headerTitle: 'Takvim',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="planner"
        options={{
          href: null,
          headerTitle: 'Planlayıcı',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
          headerTitle: 'Bildirimler',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="astronomy"
        options={{
          href: null,
          headerTitle: 'Burçlar',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="menstrual"
        options={{
          href: null,
          headerTitle: 'Adet Takvimi',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
          headerTitle: 'Keşfet',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
