/**
 * Root Layout — Health Memory App
 */

import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      // Not logged in -> go to login
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // Logged in and on login/register -> redirect appropriately
      if (user.role === 'patient' && !onboardingComplete) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    } else if (user && user.role === 'patient' && !onboardingComplete && segments[0] !== 'onboarding') {
      // Patient hasn't completed onboarding -> force onboarding
      router.replace('/onboarding');
    } else if (user && onboardingComplete && segments[0] === 'onboarding') {
      // Onboarding complete, get out of onboarding page
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments, onboardingComplete]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F8F9FC' } }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="onboarding" />
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
    </AuthProvider>
  );
}
