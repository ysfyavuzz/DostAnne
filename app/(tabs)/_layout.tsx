import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, View, StyleSheet } from 'react-native';
import { Colors } from '../../src/constants/Colors';
import { GlassView } from '../../src/components/ui/GlassView';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.brand.green[600],
        tabBarInactiveTintColor: Colors.neutral[400],
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 24 : 16,
          left: 16,
          right: 16,
          height: 64,
          borderRadius: 32,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarBackground: () => (
          <GlassView
            style={StyleSheet.absoluteFillObject}
            intensity={80}
            tint="light"
            borderless
          >
            <View style={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 32,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.5)',
            }} />
          </GlassView>
        ),
        tabBarShowLabel: false,
        tabBarItemStyle: {
          height: 64,
          paddingTop: 0,
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
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              top: Platform.OS === 'ios' ? 12 : 0,
            }}>
              <View style={{
                width: focused ? 48 : 40,
                height: focused ? 48 : 40,
                borderRadius: 24,
                backgroundColor: focused ? Colors.brand.green[100] : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Ionicons
                  name={focused ? 'home' : 'home-outline'}
                  size={24}
                  color={focused ? Colors.brand.green[600] : color}
                />
              </View>
            </View>
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
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              top: Platform.OS === 'ios' ? 12 : 0,
            }}>
              <View style={{
                width: focused ? 48 : 40,
                height: focused ? 48 : 40,
                borderRadius: 24,
                backgroundColor: focused ? Colors.activity.feeding + '20' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Ionicons
                  name={focused ? 'pulse' : 'pulse-outline'}
                  size={24}
                  color={focused ? Colors.activity.feeding : color}
                />
              </View>
            </View>
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
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              top: Platform.OS === 'ios' ? 12 : 0,
            }}>
              <View style={{
                width: focused ? 48 : 40,
                height: focused ? 48 : 40,
                borderRadius: 24,
                backgroundColor: focused ? Colors.activity.milestone + '20' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Ionicons
                  name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
                  size={24}
                  color={focused ? Colors.activity.milestone : color}
                />
              </View>
            </View>
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
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              top: Platform.OS === 'ios' ? 12 : 0,
            }}>
              <View style={{
                width: focused ? 48 : 40,
                height: focused ? 48 : 40,
                borderRadius: 24,
                backgroundColor: focused ? Colors.activity.sleep + '20' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Ionicons
                  name={focused ? 'bar-chart' : 'bar-chart-outline'}
                  size={24}
                  color={focused ? Colors.activity.sleep : color}
                />
              </View>
            </View>
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
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              top: Platform.OS === 'ios' ? 12 : 0,
            }}>
              <View style={{
                width: focused ? 48 : 40,
                height: focused ? 48 : 40,
                borderRadius: 24,
                backgroundColor: focused ? Colors.brand.orange[100] : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Ionicons
                  name={focused ? 'person' : 'person-outline'}
                  size={24}
                  color={focused ? Colors.brand.orange[500] : color}
                />
              </View>
            </View>
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
