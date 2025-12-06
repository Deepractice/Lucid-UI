/**
 * Lucid UI Color System
 *
 * Design Philosophy:
 * - 白灰为主，冷色调
 * - 专业克制，拒绝 AI 紫
 * - 清晰明澈，舒适阅读
 */

export const colors = {
  // 灰度系统（核心）
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },

  // 主色（冷蓝，克制使用）
  primary: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
    950: '#082F49',
  },

  // 成功色（绿）
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
    950: '#052E16',
  },

  // 警告色（琥珀）
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
    950: '#451A03',
  },

  // 错误色（红）
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
    950: '#450A0A',
  },

  // 白色
  white: '#FFFFFF',

  // 黑色
  black: '#000000',

  // 透明
  transparent: 'transparent',
} as const

// 语义化颜色
export const semanticColors = {
  // 背景
  background: {
    DEFAULT: colors.white,
    subtle: colors.gray[50],
    muted: colors.gray[100],
    emphasis: colors.gray[200],
  },

  // 前景/文字
  foreground: {
    DEFAULT: colors.gray[900],
    muted: colors.gray[600],
    subtle: colors.gray[500],
    disabled: colors.gray[400],
  },

  // 边框
  border: {
    DEFAULT: colors.gray[200],
    muted: colors.gray[100],
    emphasis: colors.gray[300],
  },

  // 交互状态
  interactive: {
    DEFAULT: colors.primary[500],
    hover: colors.primary[600],
    active: colors.primary[700],
    disabled: colors.gray[300],
  },
} as const

export type Colors = typeof colors
export type SemanticColors = typeof semanticColors
