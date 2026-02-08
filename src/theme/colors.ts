// SafeScan Color Palette - Based on Proofpoint Security Lens mockups

export const colors = {
  // Primary brand colors
  primary: {
    navy: '#0A1628',
    darkNavy: '#050D18',
    blue: '#1E3A5F',
    accent: '#00D9FF',
    teal: '#00B8D4',
  },

  // Status colors
  status: {
    safe: '#00C853',
    safeLight: '#69F0AE',
    safeDark: '#00A844',
    
    warning: '#FFB300',
    warningLight: '#FFE082',
    warningDark: '#FF8F00',
    
    danger: '#FF3D00',
    dangerLight: '#FF8A65',
    dangerDark: '#DD2C00',
    
    training: '#7C4DFF',
    trainingLight: '#B388FF',
    trainingDark: '#651FFF',
  },

  // UI colors
  ui: {
    background: '#0A1628',
    surface: '#132337',
    surfaceLight: '#1E3A5F',
    card: '#162942',
    cardHover: '#1E3A5F',
    
    border: '#2A4A6A',
    borderLight: '#3A5A7A',
    
    overlay: 'rgba(10, 22, 40, 0.95)',
    overlayLight: 'rgba(10, 22, 40, 0.8)',
  },

  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#A8C0D8',
    tertiary: '#6B8AAB',
    muted: '#4A6A8A',
    inverse: '#0A1628',
  },

  // Scanner specific
  scanner: {
    frame: '#00D9FF',
    frameActive: '#00FF88',
    overlay: 'rgba(10, 22, 40, 0.7)',
    progress: '#00D9FF',
  },

  // Gradient presets
  gradients: {
    primary: ['#0A1628', '#132337'],
    danger: ['#DD2C00', '#FF3D00'],
    safe: ['#00A844', '#00C853'],
    training: ['#651FFF', '#7C4DFF'],
    scanner: ['rgba(0, 217, 255, 0.1)', 'rgba(0, 217, 255, 0)'],
  },
} as const;

export type Colors = typeof colors;
