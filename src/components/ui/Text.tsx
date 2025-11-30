/**
 * Text Component
 * Theme-aware, responsive text with typography presets
 */

import React from 'react';
import { Text as RNText, TextStyle, StyleSheet } from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { colors, typography } from '../../theme/theme';
import type { ColorScheme } from '../../theme/theme';

interface TextProps {
    children: React.ReactNode;

    // Typography variants
    variant?: keyof typeof typography;

    // Colors
    color?: keyof ColorScheme;

    // Alignment
    align?: 'left' | 'center' | 'right';

    // Weight override
    weight?: '400' | '500' | '600' | '700';

    // Number of lines
    numberOfLines?: number;

    // Custom style
    style?: TextStyle;
}

export const Text: React.FC<TextProps> = ({
    children,
    variant = 'bodyMedium',
    color = 'text',
    align = 'left',
    weight,
    numberOfLines,
    style,
}) => {
    const theme = useThemeStore(state => state.theme);
    const themeColors = colors[theme];

    const textStyle: TextStyle = {
        ...typography[variant],
        color: themeColors[color],
        textAlign: align,
        ...(weight && { fontWeight: weight }),
    };

    return (
        <RNText style={[textStyle, style]} numberOfLines={numberOfLines}>
            {children}
        </RNText>
    );
};
