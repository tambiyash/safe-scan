// SafeScan Scanner Overlay - Dark overlay with cutout for scanner frame

import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { colors, typography, spacing } from '../../theme';
import { ScannerFrame } from './ScannerFrame';

interface ScannerOverlayProps {
  frameSize?: number;
  isScanning?: boolean;
  isSuccess?: boolean;
  message?: string;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DEFAULT_FRAME_SIZE = SCREEN_WIDTH * 0.7;

export const ScannerOverlay: React.FC<ScannerOverlayProps> = ({
  frameSize = DEFAULT_FRAME_SIZE,
  isScanning = true,
  isSuccess = false,
  message = 'Position QR code within the frame',
}) => {
  const overlayHeight = (SCREEN_HEIGHT - frameSize) / 2;
  const sideWidth = (SCREEN_WIDTH - frameSize) / 2;

  return (
    <View style={styles.container}>
      {/* Top overlay */}
      <View style={[styles.overlay, { height: overlayHeight }]} />

      {/* Middle row with side overlays and frame */}
      <View style={styles.middleRow}>
        <View style={[styles.overlay, { width: sideWidth, height: frameSize }]} />
        <View style={styles.frameContainer}>
          <ScannerFrame size={frameSize} isScanning={isScanning} isSuccess={isSuccess} />
        </View>
        <View style={[styles.overlay, { width: sideWidth, height: frameSize }]} />
      </View>

      {/* Bottom overlay with message */}
      <View style={[styles.overlay, styles.bottomOverlay, { height: overlayHeight }]}>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  overlay: {
    backgroundColor: colors.scanner.overlay,
  },
  middleRow: {
    flexDirection: 'row',
  },
  frameContainer: {
    backgroundColor: 'transparent',
  },
  bottomOverlay: {
    alignItems: 'center',
    paddingTop: spacing['3xl'],
  },
  message: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing['2xl'],
  },
});
