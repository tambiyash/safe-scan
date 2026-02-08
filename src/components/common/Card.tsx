// SafeScan Card Component

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'danger' | 'success' | 'warning' | 'info';
  padding?: keyof typeof spacing | number;
  style?: ViewStyle;
}

const variantStyles: Record<string, { bg: string; border?: string }> = {
  default: {
    bg: colors.ui.card,
  },
  elevated: {
    bg: colors.ui.surface,
  },
  outlined: {
    bg: 'transparent',
    border: colors.ui.border,
  },
  danger: {
    bg: 'rgba(255, 61, 0, 0.1)',
    border: colors.status.danger,
  },
  success: {
    bg: 'rgba(0, 200, 83, 0.1)',
    border: colors.status.safe,
  },
  warning: {
    bg: 'rgba(255, 179, 0, 0.1)',
    border: colors.status.warning,
  },
  info: {
    bg: 'rgba(0, 217, 255, 0.1)',
    border: colors.primary.accent,
  },
};

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'lg',
  style,
}) => {
  const variantStyle = variantStyles[variant];
  const paddingValue = typeof padding === 'number' ? padding : spacing[padding];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: variantStyle.bg,
          padding: paddingValue,
          borderColor: variantStyle.border || 'transparent',
          borderWidth: variantStyle.border ? 1 : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
  },
});
