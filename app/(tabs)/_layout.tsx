/**
 * Tab Layout — Bottom Navigation
 *
 * 5-tab navigation matching the UI reference:
 * Home, Health Memory, Care Team, Learn, Profile
 *
 * Custom styled with large icons and labels for elderly accessibility.
 */

import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, shadows } from '../../src/theme';

type TabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
  focused: boolean;
};

const TabIcon = ({ name, color, size, focused }: TabIconProps) => (
  <View style={focused ? styles.activeIconContainer : undefined}>
    <Ionicons name={name} size={size} color={color} />
  </View>
);

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary.deepBlue,
        tabBarInactiveTintColor: colors.neutral.gray400,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 60 + bottomPadding,
            paddingBottom: bottomPadding,
          },
        ],
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={24}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="health-memory"
        options={{
          title: 'Health Memory',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name={focused ? 'time' : 'time-outline'}
              color={color}
              size={24}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="care-team"
        options={{
          title: 'Care Team',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name={focused ? 'people' : 'people-outline'}
              color={color}
              size={24}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name={focused ? 'book' : 'book-outline'}
              color={color}
              size={24}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name={focused ? 'person' : 'person-outline'}
              color={color}
              size={24}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.neutral.white,
    borderTopWidth: 0,
    paddingTop: 6,
    ...shadows.bottomTab,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  tabItem: {
    paddingTop: 2,
  },
  activeIconContainer: {
    // subtle active indicator
  },
});
