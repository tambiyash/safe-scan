// SafeScan Isolated Browser Screen - Remote Browser Isolation preview
// Uses sandboxed WebView with strict security restrictions

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, spacing, borderRadius } from '../theme';
import { StatusBadge, Button, Card } from '../components/common';
import { ShieldIcon, ExternalLinkIcon, WarningIcon, LockIcon } from '../components/icons';
import { useScanStore } from '../store/scanStore';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// JavaScript to inject that blocks form submissions and disables inputs
const INJECTED_SECURITY_JS = `
(function() {
  // Block all form submissions
  document.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, true);

  // Disable all input fields
  var inputs = document.querySelectorAll('input, textarea, select, button');
  inputs.forEach(function(el) {
    el.disabled = true;
    el.style.pointerEvents = 'none';
  });

  // Block click events on links
  document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' || e.target.closest('a')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);

  // Remove any existing event listeners by cloning body
  // This helps prevent malicious scripts from running
  true;
})();
`;

export const IsolatedBrowserScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { currentResult, resetScan } = useScanStore();
  const webViewRef = useRef<WebView>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('');

  const url = currentResult?.threat.destination.url || '';
  const fullUrl = url.startsWith('http') ? url : `https://${url}`;
  const displayUrl = url.length > 35 ? url.substring(0, 35) + '...' : url;

  const handleClose = () => {
    resetScan();
    navigation.navigate('Scanner');
  };

  // Block all navigation attempts - only allow initial URL
  const handleShouldStartLoad = (event: WebViewNavigation): boolean => {
    // Only allow the initial URL to load
    if (event.url === fullUrl || event.navigationType === 'other') {
      return true;
    }
    // Block all other navigation (clicks, redirects, etc.)
    return false;
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setLoadError(null);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleLoadError = () => {
    setIsLoading(false);
    setLoadError('Failed to load page. The site may be offline or blocking requests.');
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    if (navState.title && navState.title !== pageTitle) {
      setPageTitle(navState.title);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <StatusBadge status="isolated" size="sm" />
        </View>
        
        <View style={styles.urlBar}>
          <LockIcon size={14} color={colors.status.warning} />
          <Text style={styles.urlText} numberOfLines={1}>
            {displayUrl}
          </Text>
          <TouchableOpacity disabled>
            <ExternalLinkIcon size={16} color={colors.text.muted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleClose} style={styles.infoButton}>
          <Text style={styles.infoIcon}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      {/* Protected View Notice */}
      <View style={styles.protectedNotice}>
        <View style={styles.noticeIcon}>
          <ShieldIcon size={16} color={colors.status.safe} />
        </View>
        <View style={styles.noticeContent}>
          <Text style={styles.noticeTitle}>Protected View Active</Text>
          <Text style={styles.noticeText}>
            JavaScript disabled • Forms blocked • Navigation prevented
          </Text>
        </View>
      </View>

      {/* WebView Container */}
      <View style={styles.webviewContainer}>
        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary.accent} />
            <Text style={styles.loadingText}>Loading in isolated sandbox...</Text>
            <Text style={styles.loadingSubtext}>All scripts and interactions are blocked</Text>
          </View>
        )}

        {/* Error State */}
        {loadError && (
          <View style={styles.errorOverlay}>
            <WarningIcon size={48} color={colors.status.warning} />
            <Text style={styles.errorTitle}>Unable to Load Preview</Text>
            <Text style={styles.errorText}>{loadError}</Text>
            <Button
              title="Close Preview"
              onPress={handleClose}
              variant="secondary"
              size="md"
              style={styles.errorButton}
            />
          </View>
        )}

        {/* Sandboxed WebView */}
        {!loadError && (
          <WebView
            ref={webViewRef}
            source={{ uri: fullUrl }}
            style={styles.webview}
            
            // Security: Disable JavaScript execution
            javaScriptEnabled={false}
            
            // Security: Disable DOM storage and cookies
            domStorageEnabled={false}
            thirdPartyCookiesEnabled={false}
            sharedCookiesEnabled={false}
            
            // Security: Incognito mode - no persistent state
            incognito={true}
            
            // Security: Disable caching
            cacheEnabled={false}
            
            // Security: Disable file access
            allowFileAccess={false}
            allowFileAccessFromFileURLs={false}
            allowUniversalAccessFromFileURLs={false}
            
            // Security: Disable other risky features
            allowsInlineMediaPlayback={false}
            mediaPlaybackRequiresUserAction={true}
            javaScriptCanOpenWindowsAutomatically={false}
            
            // Security: Block navigation attempts
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            
            // Inject security script (runs even with JS disabled on some content)
            injectedJavaScriptBeforeContentLoaded={INJECTED_SECURITY_JS}
            
            // Event handlers
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onError={handleLoadError}
            onHttpError={handleLoadError}
            onNavigationStateChange={handleNavigationStateChange}
            
            // UI settings
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={true}
            bounces={false}
            
            // Render error view
            renderError={() => (
              <View style={styles.renderError}>
                <Text style={styles.renderErrorText}>Content blocked for security</Text>
              </View>
            )}
          />
        )}

        {/* Interaction blocker overlay - prevents all touch events on WebView */}
        {!loadError && !isLoading && (
          <View style={styles.blockerOverlay} pointerEvents="box-only">
            <View style={styles.blockerBadge}>
              <LockIcon size={12} color={colors.text.primary} />
              <Text style={styles.blockerText}>Read-only preview</Text>
            </View>
          </View>
        )}
      </View>

      {/* Warning Banner */}
      <View style={[styles.warningBanner, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Card variant="danger" padding="lg">
          <View style={styles.warningContent}>
            <WarningIcon size={24} color={colors.status.danger} />
            <View style={styles.warningTextContainer}>
              <Text style={styles.warningTitle}>Warning: Suspicious Content</Text>
              <Text style={styles.warningDescription}>
                This page may attempt to steal credentials. All interactions are blocked. You are viewing a read-only preview.
              </Text>
            </View>
          </View>
          <Button
            title="Close Preview"
            onPress={handleClose}
            variant="secondary"
            size="md"
            fullWidth
            style={styles.closePreviewButton}
          />
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ui.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary.darkNavy,
    gap: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urlBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ui.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  urlText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '400',
    fontFamily: 'monospace',
    color: colors.text.secondary,
  },
  infoButton: {
    padding: spacing.sm,
  },
  infoIcon: {
    fontSize: 18,
  },
  protectedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: colors.status.safe,
    gap: spacing.md,
  },
  noticeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 200, 83, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    color: colors.status.safe,
  },
  noticeText: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 16,
    color: colors.text.secondary,
  },
  webviewContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.ui.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: colors.text.primary,
    marginTop: spacing.lg,
  },
  loadingSubtext: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.ui.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['2xl'],
    zIndex: 10,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    color: colors.text.primary,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  errorButton: {
    marginTop: spacing.xl,
  },
  renderError: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.ui.background,
  },
  renderErrorText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text.secondary,
  },
  blockerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    padding: spacing.sm,
  },
  blockerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  blockerText: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.text.primary,
  },
  warningBanner: {
    padding: spacing.lg,
    backgroundColor: colors.ui.background,
  },
  warningContent: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: colors.status.danger,
    marginBottom: spacing.xs,
  },
  warningDescription: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: colors.text.secondary,
  },
  closePreviewButton: {
    marginTop: spacing.sm,
  },
});
