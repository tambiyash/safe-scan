// SafeScan Scanner Frame Component - Animated QR code scanning frame

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { colors } from '../../theme';

interface ScannerFrameProps {
  size?: number;
  isScanning?: boolean;
  isSuccess?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_SIZE = SCREEN_WIDTH * 0.7;

export const ScannerFrame: React.FC<ScannerFrameProps> = ({
  size = DEFAULT_SIZE,
  isScanning = true,
  isSuccess = false,
}) => {
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const cornerSize = size * 0.12;
  const cornerThickness = 4;

  useEffect(() => {
    if (isScanning && !isSuccess) {
      // Scan line animation
      const scanAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

      // Pulse animation for corners
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

      scanAnimation.start();
      pulseAnimation.start();

      return () => {
        scanAnimation.stop();
        pulseAnimation.stop();
      };
    }
  }, [isScanning, isSuccess]);

  const frameColor = isSuccess ? colors.scanner.frameActive : colors.scanner.frame;

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, size - 4],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      {/* Corner pieces */}
      {/* Top Left */}
      <View style={[styles.corner, styles.topLeft]}>
        <View
          style={[
            styles.cornerHorizontal,
            {
              width: cornerSize,
              height: cornerThickness,
              backgroundColor: frameColor,
            },
          ]}
        />
        <View
          style={[
            styles.cornerVertical,
            {
              width: cornerThickness,
              height: cornerSize,
              backgroundColor: frameColor,
            },
          ]}
        />
      </View>

      {/* Top Right */}
      <View style={[styles.corner, styles.topRight]}>
        <View
          style={[
            styles.cornerHorizontal,
            {
              width: cornerSize,
              height: cornerThickness,
              backgroundColor: frameColor,
            },
          ]}
        />
        <View
          style={[
            styles.cornerVertical,
            {
              width: cornerThickness,
              height: cornerSize,
              backgroundColor: frameColor,
            },
          ]}
        />
      </View>

      {/* Bottom Left */}
      <View style={[styles.corner, styles.bottomLeft]}>
        <View
          style={[
            styles.cornerHorizontal,
            {
              width: cornerSize,
              height: cornerThickness,
              backgroundColor: frameColor,
            },
          ]}
        />
        <View
          style={[
            styles.cornerVertical,
            {
              width: cornerThickness,
              height: cornerSize,
              backgroundColor: frameColor,
            },
          ]}
        />
      </View>

      {/* Bottom Right */}
      <View style={[styles.corner, styles.bottomRight]}>
        <View
          style={[
            styles.cornerHorizontal,
            {
              width: cornerSize,
              height: cornerThickness,
              backgroundColor: frameColor,
            },
          ]}
        />
        <View
          style={[
            styles.cornerVertical,
            {
              width: cornerThickness,
              height: cornerSize,
              backgroundColor: frameColor,
            },
          ]}
        />
      </View>

      {/* Scan line */}
      {isScanning && !isSuccess && (
        <Animated.View
          style={[
            styles.scanLine,
            {
              width: size - 20,
              transform: [{ translateY: scanLineTranslateY }],
            },
          ]}
        />
      )}

      {/* Inner glow effect */}
      <View
        style={[
          styles.innerGlow,
          {
            borderColor: frameColor,
            opacity: isScanning ? 0.3 : 0,
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  corner: {
    position: 'absolute',
  },
  topLeft: {
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    alignItems: 'flex-end',
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    justifyContent: 'flex-end',
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  cornerHorizontal: {
    borderRadius: 2,
  },
  cornerVertical: {
    borderRadius: 2,
    position: 'absolute',
  },
  scanLine: {
    position: 'absolute',
    top: 10,
    left: 10,
    height: 2,
    backgroundColor: colors.scanner.frame,
    shadowColor: colors.scanner.frame,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  innerGlow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
});
