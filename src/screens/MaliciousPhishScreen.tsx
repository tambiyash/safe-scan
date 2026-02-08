// SafeScan Malicious Phish Screen - High risk threat detection

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';

import { colors, spacing, borderRadius } from '../theme';
import { Header, Button, Card, StatusBadge } from '../components/common';
import { WarningIcon, ShieldIcon, XIcon, GlobeIcon, LockIcon } from '../components/icons';
import { useScanStore } from '../store/scanStore';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const MaliciousPhishScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { currentResult, recordUserAction, resetScan } = useScanStore();

  React.useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, []);

  const handleGoBack = () => {
    recordUserAction('blocked');
    resetScan();
    navigation.navigate('Scanner');
  };

  const handleOpenIsolated = () => {
    recordUserAction('proceeded');
    navigation.navigate('IsolatedBrowser');
  };

  const handleCopyUrl = () => {
    // In a real app, copy to clipboard
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const threat = currentResult?.threat;

  return (
    <LinearGradient 
      colors={[colors.status.dangerDark, colors.primary.navy]} 
      style={styles.container}
    >
      <Header 
        onBack={() => navigation.goBack()}
        statusBadge="malicious"
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
            <WarningIcon size={48} color={colors.status.danger} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Malicious Phish</Text>
        <Text style={styles.subtitle}>Threat detected</Text>

        {/* Warning Card */}
        <Card variant="danger" padding="lg" style={styles.warningCard}>
          <View style={styles.warningHeader}>
            <XIcon size={20} color={colors.status.danger} />
            <Text style={styles.warningTitle}>Dangerous Link Detected</Text>
          </View>
          <Text style={styles.warningText}>
            This QR code leads to a known phishing site. Do not proceed unless absolutely necessary.
          </Text>
        </Card>

        {/* Threat Breakdown */}
        <Card variant="elevated" padding="lg" style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>⚡ Threat Breakdown</Text>
          
          <View style={styles.threatRow}>
            <Text style={styles.threatLabel}>THREAT LEVEL</Text>
            <StatusBadge status="malicious" size="sm" />
          </View>

          <View style={styles.urlDisplay}>
            <Text style={styles.urlText} numberOfLines={2}>
              {threat?.destination?.url || 'Unknown URL'}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Threat Details */}
          {threat?.details?.map((detail, index) => (
            <View key={index} style={styles.detailItem}>
              <View style={styles.detailIcon}>
                {detail.type === 'google_safebrowsing' && <GlobeIcon size={16} color={colors.status.danger} />}
                {detail.type === 'proofpoint' && <ShieldIcon size={16} color={colors.status.danger} />}
                {detail.type === 'ssl' && <LockIcon size={16} color={colors.status.warning} />}
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailTitle}>{detail.title}</Text>
                <Text style={styles.detailDescription}>{detail.description}</Text>
              </View>
              <View style={[
                styles.severityBadge,
                detail.severity === 'critical' && styles.severityCritical,
                detail.severity === 'warning' && styles.severityWarning,
              ]}>
                <Text style={styles.severityText}>{detail.severity.toUpperCase()}</Text>
              </View>
            </View>
          ))}

          {!threat?.details?.length && (
            <>
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <GlobeIcon size={16} color={colors.status.danger} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailTitle}>Google SafeBrowsing</Text>
                  <Text style={styles.detailDescription}>Flagged as malicious</Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <ShieldIcon size={16} color={colors.status.danger} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailTitle}>Proofpoint Intelligence</Text>
                  <Text style={styles.detailDescription}>Known credential harvester</Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <LockIcon size={16} color={colors.status.warning} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailTitle}>SSL Certificate</Text>
                  <Text style={styles.detailDescription}>Invalid or expired</Text>
                </View>
              </View>
            </>
          )}
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
            title="Open in Isolated Preview"
            onPress={handleOpenIsolated}
            variant="danger"
            size="lg"
            fullWidth
          />
          <Button
            title="Copy URL"
            onPress={handleCopyUrl}
            variant="ghost"
            size="md"
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
    backgroundColor: 'rgba(255, 61, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.status.danger,
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
    color: colors.status.danger,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  warningCard: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: colors.status.danger,
  },
  warningText: {
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
  threatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  threatLabel: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
    color: colors.text.tertiary,
  },
  urlDisplay: {
    backgroundColor: colors.ui.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  urlText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    fontFamily: 'monospace',
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.ui.border,
    marginBottom: spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.border,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.ui.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    color: colors.text.primary,
  },
  detailDescription: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: colors.text.secondary,
  },
  severityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.ui.surface,
  },
  severityCritical: {
    backgroundColor: 'rgba(255, 61, 0, 0.2)',
  },
  severityWarning: {
    backgroundColor: 'rgba(255, 179, 0, 0.2)',
  },
  severityText: {
    fontSize: 8,
    fontWeight: '500',
    lineHeight: 14,
    color: colors.text.secondary,
  },
  actions: {
    width: '100%',
    gap: spacing.md,
    alignItems: 'center',
  },
});
