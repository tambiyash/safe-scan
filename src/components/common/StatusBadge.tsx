// SafeScan Status Badge Component

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';
import { ThreatLevel } from '../../types';

interface StatusBadgeProps {
  status: ThreatLevel | 'training' | 'verified' | 'isolated';
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  safe: {
    bg: colors.status.safe,
    text: colors.text.primary,
    label: 'VERIFIED',
  },
  suspicious: {
    bg: colors.status.warning,
    text: colors.primary.darkNavy,
    label: 'SUSPICIOUS',
  },
  malicious: {
    bg: colors.status.danger,
    text: colors.text.primary,
    label: 'HIGH RISK',
  },
  simulation: {
    bg: colors.status.training,
    text: colors.text.primary,
    label: 'TRAINING MODE',
  },
  training: {
    bg: colors.status.training,
    text: colors.text.primary,
    label: 'TRAINING MODE',
  },
  verified: {
    bg: colors.status.safe,
    text: colors.text.primary,
    label: 'VERIFIED',
  },
  isolated: {
    bg: colors.status.danger,
    text: colors.text.primary,
    label: 'ISOLATED BROWSER',
  },
};

const sizeConfig = {
  sm: { paddingH: spacing.sm, paddingV: 2, fontSize: 9 },
  md: { paddingH: spacing.md, paddingV: 4, fontSize: 10 },
  lg: { paddingH: spacing.lg, paddingV: 6, fontSize: 11 },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = statusConfig[status] || statusConfig.suspicious;
  const sizeStyle = sizeConfig[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          paddingHorizontal: sizeStyle.paddingH,
          paddingVertical: sizeStyle.paddingV,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: config.text,
            fontSize: sizeStyle.fontSize,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
