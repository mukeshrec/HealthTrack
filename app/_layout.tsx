/**
 * Root Layout — MyCare+ Enterprise Medical App
 *
 * Configures:
 * - 5-Second White Animated Landing Page on Startup
 * - Auth Provider & Role-based Navigation Guard
 * - Deep linking & splash screen management
 */

import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { LandingScreen } from '../src/components/common';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, isLoading, onboardingComplete } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

    if (!user && !inAuthGroup) {
      router.replace('/login');
    } else if (user && inAuthGroup) {
      if (user.role === 'patient' && !onboardingComplete) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    } else if (user && user.role === 'patient' && !onboardingComplete && segments[0] !== 'onboarding') {
      router.replace('/onboarding');
    } else if (user && onboardingComplete && segments[0] === 'onboarding') {
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments, onboardingComplete]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F8FAFC' } }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="upload" options={{ presentation: 'modal' }} />
        <Stack.Screen name="chat/[patientId]" options={{ presentation: 'card' }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: true, headerTitle: '' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <AuthProvider>
      <RootLayoutNav />

      {/* 5-Second Animated Landing Page */}
      {showLanding && (
        <LandingScreen
          durationMs={5000}
          onFinish={() => setShowLanding(false)}
        />
      )}
    </AuthProvider>
  );
}
