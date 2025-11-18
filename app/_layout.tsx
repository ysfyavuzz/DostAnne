import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/store/store';
import { useDatabase } from '../src/hooks/useDatabase';
import { View, Text, ActivityIndicator } from 'react-native';

function AppContent() {
  const router = useRouter();
  const { currentBaby, loading, initializeData } = useDatabase();
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    if (!loading && !isReady) {
      setIsReady(true);
      setTimeout(() => {
        if (currentBaby) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      }, 100);
    }
  }, [currentBaby, loading, isReady]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
