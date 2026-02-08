// SafeScan Simulation Detected Screen - Training mode phish detection

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, spacing, borderRadius } from '../theme';
import { Header, Button, Card } from '../components/common';
import { WarningIcon, ShieldIcon, ExternalLinkIcon } from '../components/icons';
import { useScanStore } from '../store/scanStore';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SimulationDetectedScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { currentResult, recordUserAction, resetScan } = useScanStore();

  const handleGoBack = () => {
    recordUserAction('blocked');
    navigation.navigate('Success');
  };

  const handleContinue = () => {
    recordUserAction('proceeded');
    // In a real app, this would open in an isolated browser
    // For now, just reset and go back
    resetScan();
    navigation.navigate('Scanner');
  };

  const threat = currentResult?.threat;

  return (
    <LinearGradient 
      colors={[colors.status.trainingDark, colors.primary.navy]} 
      style={styles.container}
    >
      <Header 
        onBack={() => navigation.goBack()}
        statusBadge="training"
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing['2xl'] }
        ]}
      >
        {/* Alert Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <WarningIcon size={48} color={colors.status.training} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Simulation Detected</Text>
        <Text style={styles.subtitle}>Security awareness test</Text>

        {/* Info Card */}
        <Card variant="info" padding="lg" style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <ShieldIcon size={20} color={colors.primary.accent} />
            <Text style={styles.infoTitle}>This is a Simulated Phish</Text>
          </View>
          <Text style={styles.infoText}>
            {threat?.simulation?.trainingMessage || 
              'This QR code was created by your security team to test your awareness. Great job scanning it safely!'}
          </Text>
        </Card>

        {/* Destination Info */}
        <Card variant="elevated" padding="lg" style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>📍 Destination URL</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Redirects to:</Text>
            <Text style={styles.urlText} numberOfLines={2}>
              {threat?.destination?.redirectsTo || threat?.destination?.url || 'Unknown'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Risk Level</Text>
              <Text style={[styles.metaValue, { color: colors.status.training }]}>
                Simulation
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Source</Text>
              <Text style={styles.metaValue}>
                {threat?.simulation?.source || 'Proofpoint Training'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Go Back (Recommended)"
            onPress={handleGoBack}
            variant="success"
            size="lg"
            fullWidth
            icon={<ShieldIcon size={20} color={colors.text.primary} />}
          />
          <Button
            title="Continue to Link"
            onPress={handleContinue}
            variant="outline"
            size="lg"
            fullWidth
            icon={<ExternalLinkIcon size={20} color={colors.primary.accent} />}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(124, 77, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.status.training,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: colors.status.training,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  infoCard: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: colors.primary.accent,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.text.secondary,
  },
  detailsCard: {
    width: '100%',
    marginBottom: spacing['2xl'],
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  detailRow: {
    marginBottom: spacing.md,
  },
  detailLabel: {
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
    color: colors.text.primary,
    backgroundColor: colors.ui.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: colors.ui.border,
    marginVertical: spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: colors.text.primary,
  },
  actions: {
    width: '100%',
    gap: spacing.md,
  },
});
