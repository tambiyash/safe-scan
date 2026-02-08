// SafeScan Header Component

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../../theme';
import { ArrowLeftIcon, MenuIcon, XIcon } from '../icons';
import { StatusBadge } from './StatusBadge';
import { ThreatLevel } from '../../types';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  onClose?: () => void;
  onMenu?: () => void;
  statusBadge?: ThreatLevel | 'training' | 'verified' | 'isolated';
  transparent?: boolean;
  centerContent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBack,
  onClose,
  onMenu,
  statusBadge,
  transparent = false,
  centerContent,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + spacing.sm },
        transparent && styles.transparent,
      ]}
    >
      <View style={styles.row}>
        {/* Left side */}
        <View style={styles.left}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.iconButton}>
              <ArrowLeftIcon size={24} color={colors.text.primary} />
            </TouchableOpacity>
          )}
          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.iconButton}>
              <XIcon size={20} color={colors.text.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Center */}
        <View style={styles.center}>
          {centerContent || (
            <>
              {title && <Text style={styles.title}>{title}</Text>}
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </>
          )}
        </View>

        {/* Right side */}
        <View style={styles.right}>
          {statusBadge && <StatusBadge status={statusBadge} size="md" />}
          {onMenu && (
            <TouchableOpacity onPress={onMenu} style={styles.iconButton}>
              <MenuIcon size={24} color={colors.text.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.ui.background,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  transparent: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  center: {
    flex: 2,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconButton: {
    padding: spacing.sm,
    marginHorizontal: -spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: colors.text.secondary,
    marginTop: 2,
  },
});
