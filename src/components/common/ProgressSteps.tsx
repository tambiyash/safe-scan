// SafeScan Progress Steps Component

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, spacing } from '../../theme';
import { CheckIcon } from '../icons';
import { AnalyzingStep } from '../../types';

interface ProgressStepsProps {
  steps: AnalyzingStep[];
  showProgress?: boolean;
}

const StepItem: React.FC<{ step: AnalyzingStep; index: number }> = ({ step }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (step.status === 'complete') {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [step.status, fadeAnim, scaleAnim]);

  const getStatusColor = () => {
    switch (step.status) {
      case 'complete':
        return colors.status.safe;
      case 'active':
        return colors.primary.accent;
      case 'error':
        return colors.status.danger;
      default:
        return colors.text.muted;
    }
  };

  return (
    <Animated.View
      style={[
        styles.step,
        {
          opacity: step.status === 'pending' ? 0.5 : 1,
        },
      ]}
    >
      <View style={[styles.stepIndicator, { borderColor: getStatusColor() }]}>
        {step.status === 'complete' ? (
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <CheckIcon size={14} color={colors.status.safe} />
          </Animated.View>
        ) : step.status === 'active' ? (
          <View style={[styles.activeDot, { backgroundColor: colors.primary.accent }]} />
        ) : null}
      </View>
      <Text
        style={[
          styles.stepLabel,
          step.status === 'complete' && styles.stepLabelComplete,
          step.status === 'active' && styles.stepLabelActive,
        ]}
      >
        {step.label}
      </Text>
    </Animated.View>
  );
};

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps, showProgress = true }) => {
  const completedSteps = steps.filter(s => s.status === 'complete').length;
  const progress = completedSteps / steps.length;

  return (
    <View style={styles.container}>
      {showProgress && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      )}
      <View style={styles.steps}>
        {steps.map((step, index) => (
          <StepItem key={step.id} step={step} index={index} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.ui.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.accent,
    borderRadius: 2,
  },
  steps: {
    gap: spacing.md,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.ui.background,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.text.tertiary,
  },
  stepLabelComplete: {
    color: colors.status.safe,
  },
  stepLabelActive: {
    color: colors.text.primary,
  },
});
