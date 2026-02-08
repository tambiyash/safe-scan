// SafeScan Theme - Main export

export { colors } from './colors';
export { typography, fontWeights } from './typography';
export { spacing, borderRadius, iconSizes } from './spacing';

import { colors } from './colors';
import { typography, fontWeights } from './typography';
import { spacing, borderRadius, iconSizes } from './spacing';

export const theme = {
  colors,
  typography,
  fontWeights,
  spacing,
  borderRadius,
  iconSizes,
} as const;

export type Theme = typeof theme;
