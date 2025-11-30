/**
 * MirrorMe Theme System
 * Optimized for Meta Horizon VR viewing with high contrast and legibility
 */

export const colors = {
    light: {
        // Primary Brand Colors - Vibrant and engaging
        primary: '#6366F1', // Indigo
        primaryLight: '#818CF8',
        primaryDark: '#4F46E5',

        // Secondary Colors
        secondary: '#EC4899', // Pink
        secondaryLight: '#F472B6',
        secondaryDark: '#DB2777',

        // Accent Colors
        accent: '#10B981', // Green
        accentLight: '#34D399',
        accentDark: '#059669',

        // Neutrals - High contrast for VR readability
        background: '#FFFFFF',
        surface: '#F9FAFB',
        surfaceElevated: '#F3F4F6',

        // Text - High contrast
        text: '#111827',
        textSecondary: '#6B7280',
        textTertiary: '#9CA3AF',

        // Borders
        border: '#E5E7EB',
        borderLight: '#F3F4F6',

        // States
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',

        // AI specific
        aiGradientStart: '#6366F1',
        aiGradientEnd: '#EC4899',
        mirrorOverlay: 'rgba(99, 102, 241, 0.1)',
    },
    dark: {
        // Primary Brand Colors - Vibrant for dark mode
        primary: '#818CF8',
        primaryLight: '#A5B4FC',
        primaryDark: '#6366F1',

        // Secondary Colors
        secondary: '#F472B6',
        secondaryLight: '#F9A8D4',
        secondaryDark: '#EC4899',

        // Accent Colors
        accent: '#34D399',
        accentLight: '#6EE7B7',
        accentDark: '#10B981',

        // Neutrals - Optimized for VR dark mode
        background: '#0F172A', // Deep blue-black
        surface: '#1E293B',
        surfaceElevated: '#334155',

        // Text - High contrast on dark
        text: '#F8FAFC',
        textSecondary: '#CBD5E1',
        textTertiary: '#94A3B8',

        // Borders
        border: '#334155',
        borderLight: '#475569',

        // States
        success: '#34D399',
        warning: '#FBBF24',
        error: '#F87171',
        info: '#60A5FA',

        // AI specific
        aiGradientStart: '#818CF8',
        aiGradientEnd: '#F472B6',
        mirrorOverlay: 'rgba(129, 140, 248, 0.15)',
    },
} as const;

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
} as const;

export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
} as const;

// Typography - Optimized for VR legibility (larger sizes)
export const typography = {
    // Display text
    displayLarge: {
        fontSize: 48,
        fontWeight: '700' as const,
        lineHeight: 56,
        letterSpacing: -0.5,
    },
    displayMedium: {
        fontSize: 36,
        fontWeight: '700' as const,
        lineHeight: 44,
        letterSpacing: -0.5,
    },
    displaySmall: {
        fontSize: 28,
        fontWeight: '600' as const,
        lineHeight: 36,
        letterSpacing: 0,
    },

    // Headings
    h1: {
        fontSize: 32,
        fontWeight: '700' as const,
        lineHeight: 40,
        letterSpacing: -0.5,
    },
    h2: {
        fontSize: 24,
        fontWeight: '600' as const,
        lineHeight: 32,
        letterSpacing: 0,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 28,
        letterSpacing: 0,
    },

    // Body text - Larger for VR
    bodyLarge: {
        fontSize: 18,
        fontWeight: '400' as const,
        lineHeight: 28,
        letterSpacing: 0,
    },
    bodyMedium: {
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 24,
        letterSpacing: 0,
    },
    bodySmall: {
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
        letterSpacing: 0,
    },

    // Labels and captions
    label: {
        fontSize: 14,
        fontWeight: '500' as const,
        lineHeight: 20,
        letterSpacing: 0.1,
    },
    caption: {
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
        letterSpacing: 0.4,
    },

    // Button text
    button: {
        fontSize: 16,
        fontWeight: '600' as const,
        lineHeight: 24,
        letterSpacing: 0.2,
    },
} as const;

// Shadow styles for depth in VR
export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 12,
    },
} as const;

export type Theme = 'light' | 'dark';
export type ColorScheme = typeof colors.light;
