/**
 * GreetingCard — Personalized greeting banner
 *
 * Green gradient card with dynamic time-of-day greeting,
 * patient name, motivational message, and illustration.
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface GreetingCardProps {
  patientName: string;
  role?: string;
}

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const getGreetingEmoji = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return '☀️';
  if (hour < 17) return '🌤️';
  return '🌙';
};

export const GreetingCard: React.FC<GreetingCardProps> = ({ patientName, role = 'patient' }) => {
  return (
    <LinearGradient
      colors={['#E8F5EE', '#D4EFE3', '#C8EBD8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Left: Greeting text */}
        <View style={styles.textSection}>
          <Text style={styles.greeting}>
            {getGreeting()},
          </Text>
          <Text style={styles.name} numberOfLines={1}>
            {patientName} {getGreetingEmoji()}
          </Text>
          <Text style={styles.subtitle}>
            {role === 'patient' 
              ? "Let's take care of your health today."
              : role === 'guardian'
              ? "Here's an update on Lakshmi's health."
              : "Review your patient's daily status."}
          </Text>
        </View>

        {/* Right: Illustration + Motivational tag */}
        <View style={styles.imageSection}>
          <View style={styles.motivationBubble}>
            <Text style={styles.motivationText}>
              A healthier{'\n'}tomorrow{'\n'}together 💚
            </Text>
          </View>
          <Image
            source={require('../../../assets/images/greeting-illustration.jpg')}
            style={styles.illustration}
            resizeMode="cover"
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    minHeight: 140,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  textSection: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  greeting: {
    ...typography.bodyLarge,
    color: colors.text.primary,
  },
  name: {
    ...typography.displayMedium,
    color: colors.text.primary,
    marginTop: 2,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  imageSection: {
    alignItems: 'center',
    position: 'relative',
  },
  motivationBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  motivationText: {
    ...typography.caption,
    color: colors.primary.teal,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 16,
  },
  illustration: {
    width: 90,
    height: 90,
    borderRadius: borderRadius.xl,
  },
});
