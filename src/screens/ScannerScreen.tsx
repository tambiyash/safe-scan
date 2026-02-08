// SafeScan Main Scanner Screen

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, spacing } from '../theme';
import { ScannerOverlay } from '../components/scanner';
import { Button, Card, ProgressSteps } from '../components/common';
import { ShieldIcon, QRCodeIcon } from '../components/icons';
import { useScanStore } from '../store/scanStore';
import { performAnalysisSteps } from '../services/threatIntelligence';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ScannerScreen: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const {
    analyzingSteps,
    startScan,
    updateStatus,
    updateAnalyzingStep,
    completeScan,
    resetScan,
    userProfile,
  } = useScanStore();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || isAnalyzing) return;

    setScanned(true);
    setIsAnalyzing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    startScan(data);
    updateStatus('analyzing');

    try {
      // Update steps as they complete
      updateAnalyzingStep('url', 'active');
      
      const result = await performAnalysisSteps(data, (stepId) => {
        updateAnalyzingStep(stepId, 'complete');
        const nextStep = 
          stepId === 'url' ? 'reputation' :
          stepId === 'reputation' ? 'patterns' : null;
        if (nextStep) {
          updateAnalyzingStep(nextStep, 'active');
        }
      });

      await Haptics.notificationAsync(
        result.level === 'safe' 
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning
      );

      // Create scan result
      const scanResult = {
        id: Date.now().toString(),
        timestamp: new Date(),
        originalUrl: data,
        threat: result,
      };

      completeScan(scanResult);

      // Navigate to appropriate result screen
      setTimeout(() => {
        if (result.simulation) {
          navigation.navigate('SimulationDetected');
        } else if (result.level === 'malicious') {
          navigation.navigate('MaliciousPhish');
        } else if (result.level === 'safe') {
          navigation.navigate('SafeLink');
        } else {
          // Suspicious - treat similar to malicious
          navigation.navigate('MaliciousPhish');
        }
      }, 500);

    } catch (error) {
      Alert.alert('Error', 'Failed to analyze URL. Please try again.');
      resetScan();
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setScanned(false), 2000);
    }
  };

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <LinearGradient colors={[colors.primary.navy, colors.primary.darkNavy]} style={styles.container}>
        <View style={[styles.permissionContainer, { paddingTop: insets.top }]}>
          <ShieldIcon size={64} color={colors.primary.accent} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            SafeScan needs camera access to scan QR codes and protect you from threats.
          </Text>
          <Button
            title="Grant Permission"
            onPress={requestPermission}
            variant="primary"
            size="lg"
          />
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      <ScannerOverlay
        isScanning={!isAnalyzing}
        isSuccess={false}
        message={isAnalyzing ? 'Analyzing URL...' : 'Position QR code within the frame'}
      />

      {/* Header Overlay */}
      <View style={[styles.headerOverlay, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <ShieldIcon size={28} color={colors.primary.accent} />
            <View style={styles.logoText}>
              <Text style={styles.brandName}>SafeScan</Text>
              <Text style={styles.brandSubtitle}>Proofpoint Security Lens</Text>
            </View>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreValue}>{userProfile.score}</Text>
            <Text style={styles.scoreLabel}>Score</Text>
          </View>
        </View>
      </View>

      {/* Bottom Analysis Panel */}
      {isAnalyzing && (
        <View style={[styles.analysisPanel, { paddingBottom: insets.bottom + spacing.lg }]}>
          <Card variant="elevated" padding="xl">
            <View style={styles.analysisHeader}>
              <QRCodeIcon size={24} color={colors.primary.accent} />
              <Text style={styles.analysisTitle}>Scanning & Analyzing URL</Text>
            </View>
            <Text style={styles.analysisSubtitle}>
              Checking against threat databases...
            </Text>
            <View style={styles.analysisSteps}>
              <ProgressSteps steps={analyzingSteps} />
            </View>
            <Text style={styles.analysisProvider}>
              Verifying with Google SafeBrowsing & Proofpoint
            </Text>
          </Card>
        </View>
      )}

      {/* Protected Scanning Badge */}
      {!isAnalyzing && (
        <View style={[styles.protectedBadge, { bottom: insets.bottom + spacing['3xl'] }]}>
          <Card variant="info" padding="md">
            <View style={styles.protectedContent}>
              <ShieldIcon size={20} color={colors.primary.accent} />
              <View style={styles.protectedText}>
                <Text style={styles.protectedTitle}>Protected Scanning</Text>
                <Text style={styles.protectedSubtitle}>AI-powered threat detection</Text>
              </View>
            </View>
          </Card>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ui.background,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['3xl'],
    gap: spacing.xl,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
    color: colors.text.primary,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logoText: {
    gap: 2,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    color: colors.text.primary,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
    color: colors.status.danger,
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: colors.ui.overlay,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
    color: colors.status.safe,
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
    color: colors.text.secondary,
  },
  analysisPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    zIndex: 10,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: colors.text.primary,
  },
  analysisSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  analysisSteps: {
    marginBottom: spacing.lg,
  },
  analysisProvider: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  protectedBadge: {
    position: 'absolute',
    left: spacing.lg,
    zIndex: 10,
  },
  protectedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  protectedText: {
    gap: 2,
  },
  protectedTitle: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    color: colors.text.primary,
  },
  protectedSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
    color: colors.text.secondary,
  },
});
