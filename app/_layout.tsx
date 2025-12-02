import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/store/store';
import { useDatabase } from '../src/hooks/useDatabase';

import { AnimatedSplash } from '../src/components/AnimatedSplash';

function AppContent() {
  const router = useRouter();
  const { currentBaby, loading, initializeData } = useDatabase();
  const [isReady, setIsReady] = React.useState(false);
  const [splashFinished, setSplashFinished] = React.useState(false);

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    if (!loading && splashFinished && !isReady) {
      setIsReady(true);
      if (currentBaby) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [currentBaby, loading, isReady, splashFinished]);

  if (!splashFinished) {
    return <AnimatedSplash onFinish={() => setSplashFinished(true)} />;
  }

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
