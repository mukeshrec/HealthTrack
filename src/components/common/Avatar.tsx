/**
 * Avatar — Circular profile image
 *
 * Displays a circular image with fallback initials
 * if no image source is provided.
 */

import React from 'react';
import { StyleSheet, View, Image, Text, ImageSourcePropType } from 'react-native';
import { colors, typography } from '../../theme';

interface AvatarProps {
  source?: ImageSourcePropType;
  name?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 44,
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
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.neutral.white,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: colors.primary.teal,
    fontWeight: '600',
  },
});
