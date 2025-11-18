import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from '../store/store';

// Import screens (we'll create these next)
import HomeScreen from '../screens/HomeScreen';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import CalendarScreen from '../screens/CalendarScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FirstAidScreen from '../screens/FirstAidScreen';
import FirstAidDetailScreen from '../screens/FirstAidDetailScreen';

// Import icons
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// First Aid Stack Navigator
function FirstAidStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // We handle headers in each screen
      }}
    >
      <Stack.Screen 
        name="FirstAidList" 
        component={FirstAidScreen}
        options={{
          title: 'İlk Yardım',
        }}
      />
      <Stack.Screen 
        name="FirstAidDetail" 
        component={FirstAidDetailScreen}
        options={{
          title: 'İlk Yardım Detay',
        }}
      />
    </Stack.Navigator>
  );
}

// Tab navigator for main screens
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Ana Sayfa') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'İlk Yardım') {
            iconName = focused ? 'medkit' : 'medkit-outline';
          } else if (route.name === 'Kayıtlar') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Takvim') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Analiz') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B9D',
        tabBarInactiveTintColor: '#718096',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          height: 100,
          paddingBottom: 20,
          paddingTop: 10,
        },
        headerStyle: {
          backgroundColor: '#FF6B9D',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Ana Sayfa" 
        component={HomeScreen}
        options={{
          title: 'DostAnne',
        }}
      />
      <Tab.Screen 
        name="İlk Yardım" 
        component={FirstAidStack}
        options={{
          title: 'İlk Yardım',
          tabBarBadge: '🚨', // Emergency indicator
        }}
      />
      <Tab.Screen 
        name="Kayıtlar" 
        component={ActivitiesScreen}
        options={{
          title: 'Aktiviteler',
        }}
      />
      <Tab.Screen 
        name="Takvim" 
        component={CalendarScreen}
        options={{
          title: 'Takvim',
        }}
      />
      <Tab.Screen 
        name="Analiz" 
        component={StatisticsScreen}
        options={{
          title: 'İstatistikler',
        }}
      />
      <Tab.Screen 
        name="Profil" 
        component={ProfileScreen}
        options={{
          title: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
}

// Main navigator
export default function AppNavigator() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </Provider>
  );
}