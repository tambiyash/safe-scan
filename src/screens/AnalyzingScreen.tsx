// SafeScan Analyzing Screen - Shows detailed analysis progress

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import { colors, spacing, borderRadius } from '../theme';
import { Header, Card, ProgressSteps } from '../components/common';
import { QRCodeIcon } from '../components/icons';
import { useScanStore } from '../store/scanStore';

export const AnalyzingScreen: React.FC = () => {
  const navigation = useNavigation();
  const { currentUrl, analyzingSteps, resetScan } = useScanStore();

  const handleClose = () => {
    resetScan();
    navigation.goBack();
  };

  return (
    <LinearGradient colors={[colors.primary.navy, colors.primary.darkNavy]} style={styles.container}>
      <Header 
        title="Analyzing QR Code"
        onClose={handleClose}
      />

      <View style={styles.content}>
        {/* Animated QR Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconRing}>
            <View style={styles.iconInner}>
              <QRCodeIcon size={48} color={colors.primary.accent} />
            </View>
          </View>
          <ActivityIndicator
            size="large"
            color={colors.primary.accent}
            style={styles.spinner}
          />
        </View>

        {/* Status Text */}
        <Text style={styles.title}>Scanning & Analyzing URL</Text>
        <Text style={styles.subtitle}>Checking against threat databases...</Text>

        {/* Progress Steps Card */}
        <Card variant="elevated" padding="xl" style={styles.stepsCard}>
          <ProgressSteps steps={analyzingSteps} showProgress />
        </Card>

        {/* URL Display */}
        {currentUrl && (
          <Card variant="outlined" padding="md" style={styles.urlCard}>
            <Text style={styles.urlLabel}>Scanned URL</Text>
            <Text style={styles.urlText} numberOfLines={2}>
              {currentUrl}
            </Text>
          </Card>
        )}

        {/* Provider info */}
        <Text style={styles.providerText}>
          Verifying with Google SafeBrowsing & Proofpoint
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['2xl'],
  },
  iconContainer: {
    marginBottom: spacing['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.ui.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primary.accent,
  },
  iconInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.ui.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    position: 'absolute',
    transform: [{ scale: 1.8 }],
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing['3xl'],
  },
  stepsCard: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  urlCard: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  urlLabel: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  urlText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    fontFamily: 'monospace',
    color: colors.text.secondary,
  },
  providerText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});
