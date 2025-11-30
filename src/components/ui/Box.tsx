/**
 * Box Component
 * Responsive container with theme support
 */

import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import type { ColorScheme } from '../../theme/theme';

interface BoxProps {
    children?: React.ReactNode;

    // Spacing
    p?: keyof typeof spacing;
    px?: keyof typeof spacing;
    py?: keyof typeof spacing;
    pt?: keyof typeof spacing;
    pb?: keyof typeof spacing;
    pl?: keyof typeof spacing;
    pr?: keyof typeof spacing;

    m?: keyof typeof spacing;
    mx?: keyof typeof spacing;
    my?: keyof typeof spacing;
    mt?: keyof typeof spacing;
    mb?: keyof typeof spacing;
    ml?: keyof typeof spacing;
    mr?: keyof typeof spacing;

    // Layout
    flex?: number;
    flexDirection?: 'row' | 'column';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    gap?: keyof typeof spacing;

    // Appearance
    bg?: keyof ColorScheme;
    radius?: keyof typeof borderRadius;
    shadow?: keyof typeof shadows;

    // Dimensions
    width?: number | string;
    height?: number | string;
    maxWidth?: number | string;
    maxHeight?: number | string;

    // Custom style
    style?: ViewStyle;
}

export const Box: React.FC<BoxProps> = ({
    children,
    p, px, py, pt, pb, pl, pr,
    m, mx, my, mt, mb, ml, mr,
    flex,
    flexDirection = 'column',
    alignItems,
    justifyContent,
    gap,
    bg,
    radius,
    shadow,
    width,
    height,
    maxWidth,
    maxHeight,
    style,
}) => {
    const theme = useThemeStore((state: any) => state.theme);
    const themeColors = colors[theme as 'light' | 'dark'];

    const boxStyle: ViewStyle = {
        // Layout
        ...(flex !== undefined && { flex }),
        flexDirection,
        ...(alignItems && { alignItems }),
        ...(justifyContent && { justifyContent }),
        ...(gap && { gap: spacing[gap] }),

        // Padding
        ...(p && { padding: spacing[p] }),
        ...(px && { paddingHorizontal: spacing[px] }),
        ...(py && { paddingVertical: spacing[py] }),
        ...(pt && { paddingTop: spacing[pt] }),
        ...(pb && { paddingBottom: spacing[pb] }),
        ...(pl && { paddingLeft: spacing[pl] }),
        ...(pr && { paddingRight: spacing[pr] }),

        // Margin
        ...(m && { margin: spacing[m] }),
        ...(mx && { marginHorizontal: spacing[mx] }),
        ...(my && { marginVertical: spacing[my] }),
        ...(mt && { marginTop: spacing[mt] }),
        ...(mb && { marginBottom: spacing[mb] }),
        ...(ml && { marginLeft: spacing[ml] }),
        ...(mr && { marginRight: spacing[mr] }),

        // Appearance
        ...(bg && { backgroundColor: themeColors[bg] }),
        ...(radius && { borderRadius: borderRadius[radius] }),
        ...(shadow && shadows[shadow]),

        // Dimensions
        ...(width !== undefined && { width }),
        ...(height !== undefined && { height }),
        ...(maxWidth !== undefined && { maxWidth }),
        ...(maxHeight !== undefined && { maxHeight }),
    } as ViewStyle;

    return <View style={[boxStyle, style]}>{children}</View>;
};
