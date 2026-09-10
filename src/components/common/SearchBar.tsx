/**
 * SearchBar — Clean Medical Search Input
 *
 * Modeled after the reference UI with rounded pill shape, soft border,
 * and search icon.
 */

import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, typography, spacing } from '../../theme';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onClear?: () => void;
  onFilterPress?: () => void;
  showFilter?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Find Doctor, medications, records...',
  value,
  onChangeText,
  onClear,
  onFilterPress,
  showFilter = false,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
        />
        {value ? (
          <TouchableOpacity onPress={onClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={18} color={colors.neutral.gray400} />
          </TouchableOpacity>
        ) : (
          <Ionicons name="search" size={18} color={colors.primary.blue} />
        )}
      </View>

      {showFilter && (
        <TouchableOpacity
          style={styles.filterButton}
          onPress={onFilterPress}
          activeOpacity={0.7}
          accessibilityLabel="Filter options"
        >
          <Ionicons name="options-outline" size={18} color={colors.neutral.white} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.base,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2EAF8',
  },
  input: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.text.primary,
    paddingVertical: 0,
    marginRight: spacing.xs,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary.bright,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
