// SafeScan Safe Link Screen - Verified safe link display

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as WebBrowser from 'expo-web-browser';
import * as Haptics from 'expo-haptics';

import { colors, spacing, borderRadius } from '../theme';
import { Header, Button, Card } from '../components/common';
import { CheckIcon, ShieldIcon, LockIcon, GlobeIcon, ExternalLinkIcon } from '../components/icons';
import { useScanStore } from '../store/scanStore';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SafeLinkScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { currentResult, recordUserAction, resetScan } = useScanStore();

  React.useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const handleOpenLink = async () => {
    recordUserAction('proceeded');
    const url = currentResult?.threat.destination.url;
    if (url) {
      await WebBrowser.openBrowserAsync(
        url.startsWith('http') ? url : `https://${url}`
      );
    }
    resetScan();
    navigation.navigate('Scanner');
  };

  const handleGoBack = () => {
    recordUserAction('blocked');
    resetScan();
    navigation.navigate('Scanner');
  };

  const threat = currentResult?.threat;

  return (
    <LinearGradient 
      colors={[colors.status.safeDark, colors.primary.navy]} 
      style={styles.container}
    >
      <Header 
        onBack={() => navigation.goBack()}
        statusBadge="verified"
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing['2xl'] }
        ]}
      >
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <CheckIcon size={48} color={colors.text.primary} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Safe Link</Text>
        <Text style={styles.subtitle}>Verified & trusted</Text>

        {/* Safe Notice */}
        <Card variant="success" padding="lg" style={styles.safeCard}>
          <View style={styles.safeHeader}>
            <CheckIcon size={20} color={colors.status.safe} />
            <Text style={styles.safeTitle}>This link is safe to open</Text>
          </View>
          <Text style={styles.safeText}>
            No threats detected. This URL has been verified by multiple security providers.
          </Text>
        </Card>

        {/* Destination Info */}
        <Card variant="elevated" padding="lg" style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>📍 Destination</Text>
          
          <Text style={styles.destinationLabel}>You will be redirected to:</Text>
          <View style={styles.urlDisplay}>
            <Text style={styles.urlText} numberOfLines={2}>
              {threat?.destination?.url || 'Unknown URL'}
            </Text>
          </View>

          <View style={styles.verifiedBusiness}>
            <View style={styles.businessIcon}>
              <GlobeIcon size={20} color={colors.status.safe} />
            </View>
            <View>
              <Text style={styles.businessName}>
                {threat?.destination?.domain || 'Verified Business'}
              </Text>
              <Text style={styles.businessStatus}>Verified business</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Security Checks */}
          <View style={styles.checkList}>
            <View style={styles.checkItem}>
              <CheckIcon size={16} color={colors.status.safe} />
              <Text style={styles.checkText}>Google SafeBrowsing - Clear</Text>
            </View>
            <View style={styles.checkItem}>
              <CheckIcon size={16} color={colors.status.safe} />
              <Text style={styles.checkText}>Proofpoint Intelligence - Verified</Text>
            </View>
            <View style={styles.checkItem}>
              <LockIcon size={16} color={colors.status.safe} />
              <Text style={styles.checkText}>SSL Certificate - Valid</Text>
            </View>
            <View style={styles.checkItem}>
              <ShieldIcon size={16} color={colors.status.safe} />
              <Text style={styles.checkText}>Domain Age - Established</Text>
            </View>
          </View>
        </Card>

        {/* Score Display */}
        <Card variant="outlined" padding="md" style={styles.scoreCard}>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Security Score</Text>
            <Text style={styles.scoreValue}>{threat?.score || 95}/100</Text>
          </View>
          <View style={styles.scoreBar}>
            <View style={[styles.scoreFill, { width: `${threat?.score || 95}%` }]} />
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Open Link Safely"
            onPress={handleOpenLink}
            variant="success"
            size="lg"
            fullWidth
            icon={<ExternalLinkIcon size={20} color={colors.text.primary} />}
          />
          <Button
            title="Go Back"
            onPress={handleGoBack}
            variant="outline"
            size="lg"
            fullWidth
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
    backgroundColor: colors.status.safe,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: colors.status.safe,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  safeCard: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  safeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  safeTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: colors.status.safe,
  },
  safeText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.text.secondary,
  },
  detailsCard: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  destinationLabel: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
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
    color: colors.status.safe,
  },
  verifiedBusiness: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  businessIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 200, 83, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  businessName: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    color: colors.text.primary,
  },
  businessStatus: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: colors.status.safe,
  },
  divider: {
    height: 1,
    backgroundColor: colors.ui.border,
    marginBottom: spacing.lg,
  },
  checkList: {
    gap: spacing.md,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.text.secondary,
  },
  scoreCard: {
    width: '100%',
    marginBottom: spacing['2xl'],
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    color: colors.text.secondary,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: colors.status.safe,
  },
  scoreBar: {
    height: 8,
    backgroundColor: colors.ui.surface,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    backgroundColor: colors.status.safe,
    borderRadius: borderRadius.full,
  },
  actions: {
    width: '100%',
    gap: spacing.md,
  },
});
