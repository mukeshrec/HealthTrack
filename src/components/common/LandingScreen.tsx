/**
 * LandingScreen — 5-Second White Splash Screen
 *
 * Requirements:
 * - Pure white background
 * - Fixed official heart + cross medical emblem image
 * - Typewriter text animation for the name "mycare+"
 * - Subtle 5-second progress indicator with smooth dashboard transition
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  Easing,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../../theme';

const { width } = Dimensions.get('window');

interface LandingScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onFinish,
  durationMs = 5000,
}) => {
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const cursorOpacity = useRef(new Animated.Value(1)).current;
  const plusScale = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;

  // Typewriter state
  const [typedText, setTypedText] = useState('');
  const [showPlus, setShowPlus] = useState(false);

  useEffect(() => {
    // 1. Blinking Cursor Loop
    const cursorBlink = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ])
    );
    cursorBlink.start();

    // 2. Typewriter Effect for "mycare"
    const fullWord = 'mycare';
    const typingDelayStart = 400;
    const charInterval = 170;

    const typingTimers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 1; i <= fullWord.length; i++) {
      const timer = setTimeout(() => {
        setTypedText(fullWord.slice(0, i));
      }, typingDelayStart + i * charInterval);
      typingTimers.push(timer);
    }

    // 3. Reveal "+" with a spring bounce
    const plusTimer = setTimeout(() => {
      setShowPlus(true);
      Animated.spring(plusScale, {
        toValue: 1,
        friction: 3,
        tension: 110,
        useNativeDriver: true,
      }).start();
    }, typingDelayStart + (fullWord.length + 1) * charInterval);

    // 4. Reveal Subtitle
    const subtitleTimer = setTimeout(() => {
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 2200);

    // 5. Progress Fill
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: durationMs - 300,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();

    // 6. Auto Exit after durationMs
    const exitTimer = setTimeout(() => {
      handleExit();
    }, durationMs);

    return () => {
      typingTimers.forEach(clearTimeout);
      clearTimeout(plusTimer);
      clearTimeout(subtitleTimer);
      clearTimeout(exitTimer);
      cursorBlink.stop();
    };
  }, []);

  const handleExit = () => {
    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 400,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      onFinish();
    });
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      {/* Top Skip Button */}
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={handleExit}
        activeOpacity={0.7}
      >
        <Text style={styles.skipText}>Skip</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.text.secondary} />
      </TouchableOpacity>

      {/* Center Brand Area: Fixed Emblem + Typing Wording */}
      <View style={styles.centerContainer}>
        <View style={styles.brandRow}>
          {/* Fixed Logo Image */}
          <View style={styles.emblemWrapper}>
            <Image
              source={require('../../../assets/images/app-emblem.png')}
              style={styles.emblemImage}
              resizeMode="contain"
            />
          </View>

          {/* Typing Wording "mycare+" */}
          <View style={styles.wordingRow}>
            <Text style={styles.typedText}>{typedText}</Text>

            {/* Blinking cursor while typing */}
            {!showPlus && (
              <Animated.Text style={[styles.cursor, { opacity: cursorOpacity }]}>
                |
              </Animated.Text>
            )}

            {/* Animated "+" sign */}
            {showPlus && (
              <Animated.View style={{ transform: [{ scale: plusScale }] }}>
                <Text style={styles.plusSymbol}>+</Text>
              </Animated.View>
            )}
          </View>
        </View>

        {/* Tagline */}
        <Animated.View style={[styles.subtitleContainer, { opacity: subtitleOpacity }]}>
          <Text style={styles.subtitleText}>Intelligent Health Memory & Care</Text>
        </Animated.View>
      </View>

      {/* Bottom Progress Bar */}
      <View style={styles.bottomSection}>
        <View style={styles.progressBarTrack}>
          <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.secureText}>Encrypted & HIPAA Compliant</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  skipBtn: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    backgroundColor: '#F1F5F9',
    marginTop: spacing.md,
  },
  skipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemWrapper: {
    width: 66,
    height: 66,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemImage: {
    width: 66,
    height: 66,
  },
  wordingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typedText: {
    fontSize: 42,
    fontWeight: '800',
    color: '#0B2545',
    letterSpacing: -1,
  },
  cursor: {
    fontSize: 42,
    fontWeight: '300',
    color: '#0284C7',
    marginLeft: 2,
  },
  plusSymbol: {
    fontSize: 42,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: -1,
    marginLeft: 2,
  },
  subtitleContainer: {
    marginTop: spacing.md,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: spacing.md,
  },
  progressBarTrack: {
    width: width * 0.45,
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0284C7',
    borderRadius: 2,
  },
  secureText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
