/**
 * Tab Layout — Bottom Navigation
 *
 * Professional medical bottom navigation with custom active pill indicators
 * matching the reference blue UI design.
 */

import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, shadows, borderRadius, spacing } from '../../src/theme';

type TabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  color?: string | any;
  size: number;
  focused: boolean;
  label: string;
};

const TabIcon = ({ name, color, size, focused, label }: TabIconProps) => (
  <View style={styles.iconWrapper}>
    <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
      <Ionicons
        name={name}
        size={focused ? 22 : 20}
        color={focused ? colors.neutral.white : '#8E9DB8'}
      />
    </View>
  </View>
);

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 10);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary.blue,
        tabBarInactiveTintColor: '#8E9DB8',
        tabBarStyle: [
          styles.tabBar,
          {
            height: 64 + bottomPadding,
            paddingBottom: bottomPadding + 4,
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
              size={size}
              focused={focused}
              label="Home"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="health-memory"
        options={{
          title: 'Memory',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name={focused ? 'calendar' : 'calendar-outline'}
              color={color}
              size={size}
              focused={focused}
              label="Memory"
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
              size={size}
              focused={focused}
              label="Care Team"
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
              size={size}
              focused={focused}
              label="Learn"
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
              size={size}
              focused={focused}
              label="Profile"
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
    borderTopWidth: 1,
    borderTopColor: '#EEF2F8',
    paddingTop: 8,
    ...shadows.bottomTab,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabLabel: {
    ...typography.tiny,
    fontWeight: '600',
    marginTop: 2,
  },
  tabItem: {
    paddingTop: 2,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 38,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconContainer: {
    backgroundColor: colors.primary.blue,
    ...shadows.soft,
  },
});
