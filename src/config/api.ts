/**
 * Centralized API & Networking Client for MyCare+
 *
 * - Auto-detects local network IP from Expo development server
 * - Implements 1.5s clinical buffer delay for smooth UI feedback
 * - Provides typed HTTP helper functions (GET, POST, DELETE, UPLOAD)
 */

import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auto-detect host IP from Expo bundler
const getBackendBaseUrl = (): string => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:3000/api`;
    }
  }
  // Default fallbacks
  return 'http://172.17.99.224:3000/api';
};

export const API_BASE_URL = getBackendBaseUrl();

/**
 * Helper to add 1-2 second gap on API interactions
 */
export const delay = (ms: number = 1500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Standard fetch with auth header and 1.5s delay gap
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = await AsyncStorage.getItem('user_token');
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  // 1.5s clinical buffer gap
  await delay(1500);

  return fetch(url, {
    ...options,
    headers,
  });
}
