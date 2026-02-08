// SafeScan Success Screen - Positive reinforcement for catching phishing

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';

import { colors, spacing, borderRadius } from '../theme';
import { Button, Card } from '../components/common';
import { CheckIcon, ShieldIcon } from '../components/icons';
import { useScanStore } from '../store/scanStore';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SuccessScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { userProfile, resetScan } = useScanStore();
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Entrance animations
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: userProfile.score / 100,
      duration: 1000,
      delay: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [scaleAnim, fadeAnim, progressAnim, userProfile.score]);

  const handleContinue = () => {
    resetScan();
    navigation.navigate('Scanner');
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <LinearGradient 
      colors={[colors.status.safeDark, colors.primary.navy]} 
      style={styles.container}
    >
      <View style={[styles.content, { paddingBottom: insets.bottom + spacing['2xl'] }]}>
        {/* Close button */}
        <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
          <View style={styles.closeButton} />
        </View>

        {/* Success Icon */}
        <Animated.View 
          style={[
            styles.iconContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <View style={styles.iconOuter}>
            <View style={styles.iconInner}>
              <CheckIcon size={48} color={colors.text.primary} />
            </View>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title}>Success!</Text>
          <Text style={styles.subtitle}>You caught a simulation</Text>
        </Animated.View>

        {/* Message */}
        <Animated.View style={[styles.messageContainer, { opacity: fadeAnim }]}>
          <Text style={styles.message}>
            By not clicking through, you've demonstrated excellent security awareness. Keep up the great work!
          </Text>
        </Animated.View>

        {/* Score Card */}
        <Animated.View style={[styles.scoreCard, { opacity: fadeAnim }]}>
          <Card variant="elevated" padding="xl">
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreLabel}>Your Security Score</Text>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreIncrement}>+10</Text>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <Animated.View 
                  style={[
                    styles.progressFill,
                    { width: progressWidth }
                  ]} 
                />
              </View>
              <Text style={styles.scoreValue}>
                {userProfile.score}/100 - Excellent
              </Text>
            </View>
          </Card>
        </Animated.View>

        {/* Training Badge */}
        <Animated.View style={[styles.trainingBadge, { opacity: fadeAnim }]}>
          <Card variant="success" padding="md">
            <View style={styles.trainingContent}>
              <ShieldIcon size={20} color={colors.status.safe} />
              <View>
                <Text style={styles.trainingTitle}>Training Completed</Text>
                <Text style={styles.trainingSubtitle}>QR Code Phishing Module</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Continue Button */}
        <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
          <Button
            title="Continue"
            onPress={handleContinue}
            variant="primary"
            size="lg"
            fullWidth
          />
        </Animated.View>
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
    padding: spacing.xl,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    alignItems: 'flex-end',
  },
  closeButton: {
    width: 32,
    height: 32,
  },
  iconContainer: {
    marginVertical: spacing['3xl'],
  },
  iconOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 200, 83, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.status.safe,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  messageContainer: {
    marginBottom: spacing['2xl'],
  },
  message: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  scoreCard: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: colors.text.secondary,
  },
  scoreBadge: {
    backgroundColor: colors.status.safe,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  scoreIncrement: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    color: colors.text.primary,
  },
  progressContainer: {
    gap: spacing.sm,
  },
  progressBar: {
    height: 12,
    backgroundColor: colors.ui.surface,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.status.safe,
    borderRadius: borderRadius.full,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.status.safe,
  },
  trainingBadge: {
    width: '100%',
  },
  trainingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  trainingTitle: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    color: colors.text.primary,
  },
  trainingSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: colors.text.secondary,
  },
  spacer: {
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
  },
});
