/**
 * Avatar — Clinical Circular profile image
 *
 * Displays a circular image with fallback initials,
 * optional verification badge, and live online indicator.
 */

import React from 'react';
import { StyleSheet, View, Image, Text, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';

interface AvatarProps {
  source?: ImageSourcePropType;
  name?: string;
  size?: number;
  verified?: boolean;
  online?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 44,
  verified = false,
  online = false,
}) => {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : '?';

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
        accessibilityLabel={name ? `${name}'s profile picture` : 'Profile picture'}
      >
        {source ? (
          <Image
            source={source}
            style={[
              styles.image,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
              },
            ]}
            resizeMode="cover"
          />
        ) : (
          <Text
            style={[
              styles.initials,
              { fontSize: size * 0.38 },
            ]}
          >
            {initials}
          </Text>
        )}
      </View>

      {/* Online indicator */}
      {online && (
        <View
          style={[
            styles.onlineBadge,
            {
              width: Math.max(10, size * 0.25),
              height: Math.max(10, size * 0.25),
              borderRadius: Math.max(5, size * 0.125),
            },
          ]}
        />
      )}

      {/* Verified badge */}
      {verified && (
        <View
          style={[
            styles.verifiedBadge,
            {
              bottom: -2,
              right: -2,
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={14} color={colors.primary.blue} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: colors.primary.blue,
    fontWeight: '700',
  },
  onlineBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
  },
});
