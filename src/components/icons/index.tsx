// SafeScan Custom Icons using SVG paths rendered with View components
// For a production app, consider using @expo/vector-icons or react-native-svg

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme';

interface IconProps {
  size?: number;
  color?: string;
}

// Simple icon components using styled Views to create basic shapes
// In production, replace with proper SVG icons

export const ShieldIcon: React.FC<IconProps> = ({ size = 24, color = colors.text.primary }) => (
  <View style={[styles.iconContainer, { width: size, height: size }]}>
    <View style={[
      styles.shield,
      { 
        borderColor: color,
        width: size * 0.7,
        height: size * 0.85,
        borderRadius: size * 0.35,
        borderTopLeftRadius: size * 0.1,
        borderTopRightRadius: size * 0.1,
      }
    ]} />
  </View>
);

export const CheckIcon: React.FC<IconProps> = ({ size = 24, color = colors.status.safe }) => (
  <View style={[styles.iconContainer, { width: size, height: size }]}>
    <View style={[styles.checkmark, { borderColor: color, width: size * 0.5, height: size * 0.3 }]} />
  </View>
);

export const XIcon: React.FC<IconProps> = ({ size = 24, color = colors.status.danger }) => (
  <View style={[styles.iconContainer, { width: size, height: size }]}>
    <View style={[styles.xLine1, { backgroundColor: color, width: size * 0.7, height: 2 }]} />
    <View style={[styles.xLine2, { backgroundColor: color, width: size * 0.7, height: 2 }]} />
  </View>
);

export const WarningIcon: React.FC<IconProps> = ({ size = 24, color = colors.status.warning }) => (
  <View style={[styles.iconContainer, { width: size, height: size }]}>
    <View style={[
      styles.triangle,
      { 
        borderBottomColor: color,
        borderLeftWidth: size * 0.4,
        borderRightWidth: size * 0.4,
        borderBottomWidth: size * 0.7,
      }
    ]} />
  </View>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ size = 24, color = colors.text.primary }) => (
  <View style={[styles.iconContainer, { width: size, height: size }]}>
    <View style={[styles.arrowLeft, { borderColor: color, width: size * 0.4, height: size * 0.4 }]} />
  </View>
);

export const ExternalLinkIcon: React.FC<IconProps> = ({ size = 24, color = colors.text.primary }) => (
  <View style={[styles.iconContainer, { width: size, height: size }]}>
    <View style={[styles.externalBox, { borderColor: color, width: size * 0.6, height: size * 0.6 }]} />
    <View style={[styles.externalArrow, { backgroundColor: color, width: size * 0.35 }]} />
  </View>
);

export const QRCodeIcon: React.FC<IconProps> = ({ size = 24, color = colors.text.primary }) => (
  <View style={[styles.iconContainer, { width: size, height: size }]}>
    <View style={[styles.qrGrid, { borderColor: color }]}>
      <View style={[styles.qrCell, { backgroundColor: color, width: size * 0.2, height: size * 0.2 }]} />
      <View style={[styles.qrCell, { backgroundColor: color, width: size * 0.2, height: size * 0.2, marginLeft: size * 0.25 }]} />
    </View>
  </View>
);

export const LockIcon: React.FC<IconProps> = ({ size = 24, color = colors.status.safe }) => (
  <View style={[styles.iconContainer, { width: size, height: size }]}>
    <View style={[styles.lockTop, { borderColor: color, width: size * 0.5, height: size * 0.35 }]} />
    <View style={[styles.lockBody, { backgroundColor: color, width: size * 0.65, height: size * 0.45 }]} />
  </View>
);

export const InfoIcon: React.FC<IconProps> = ({ size = 24, color = colors.primary.accent }) => (
  <View style={[styles.iconContainer, { width: size, height: size }]}>
    <View style={[styles.infoCircle, { borderColor: color, width: size * 0.8, height: size * 0.8 }]}>
      <View style={[styles.infoDot, { backgroundColor: color, width: size * 0.12, height: size * 0.12 }]} />
      <View style={[styles.infoLine, { backgroundColor: color, width: size * 0.08, height: size * 0.25 }]} />
    </View>
  </View>
);

export const GlobeIcon: React.FC<IconProps> = ({ size = 24, color = colors.text.primary }) => (
  <View style={[styles.iconContainer, { width: size, height: size }]}>
    <View style={[styles.globe, { borderColor: color, width: size * 0.8, height: size * 0.8 }]} />
  </View>
);

export const MenuIcon: React.FC<IconProps> = ({ size = 24, color = colors.text.primary }) => (
  <View style={[styles.iconContainer, { width: size, height: size, justifyContent: 'space-evenly' }]}>
    <View style={[styles.menuLine, { backgroundColor: color, width: size * 0.15, height: size * 0.15 }]} />
    <View style={[styles.menuLine, { backgroundColor: color, width: size * 0.15, height: size * 0.15 }]} />
    <View style={[styles.menuLine, { backgroundColor: color, width: size * 0.15, height: size * 0.15 }]} />
  </View>
);

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shield: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  checkmark: {
    borderBottomWidth: 2.5,
    borderLeftWidth: 2.5,
    transform: [{ rotate: '-45deg' }],
    marginTop: -4,
  },
  xLine1: {
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
  },
  xLine2: {
    position: 'absolute',
    transform: [{ rotate: '-45deg' }],
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  arrowLeft: {
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    transform: [{ rotate: '45deg' }],
    marginLeft: 4,
  },
  externalBox: {
    borderWidth: 2,
    position: 'absolute',
    bottom: 2,
    left: 2,
  },
  externalArrow: {
    height: 2,
    position: 'absolute',
    top: 6,
    right: 4,
    transform: [{ rotate: '-45deg' }],
  },
  qrGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  qrCell: {
    margin: 1,
  },
  lockTop: {
    borderWidth: 2,
    borderBottomWidth: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    top: 2,
  },
  lockBody: {
    borderRadius: 2,
    position: 'absolute',
    bottom: 2,
  },
  infoCircle: {
    borderWidth: 2,
    borderRadius: 100,
    alignItems: 'center',
    paddingTop: 4,
  },
  infoDot: {
    borderRadius: 10,
    marginBottom: 2,
  },
  infoLine: {
    borderRadius: 2,
  },
  globe: {
    borderWidth: 2,
    borderRadius: 100,
  },
  menuLine: {
    borderRadius: 10,
  },
});
