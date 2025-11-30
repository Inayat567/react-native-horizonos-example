/**
 * Button Component
 * Interactive button with multiple variants and haptic feedback
 */

import React from 'react';
import { TouchableOpacity, ActivityIndicator, ViewStyle, StyleSheet } from 'react-native';
import { Text } from './Text';
import { Box } from './Box';
import { useThemeStore } from '../../stores/themeStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { haptics } from '../../utils/haptics';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    children: React.ReactNode;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    icon,
    iconPosition = 'left',
    style,
}) => {
    const theme = useThemeStore(state => state.theme);
    const hapticEnabled = useSettingsStore(state => state.hapticEnabled);
    const themeColors = colors[theme];

    const handlePress = () => {
        if (disabled || loading) return;
        if (hapticEnabled) haptics.medium();
        onPress();
    };

    // Size configurations
    const sizeConfig = {
        sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, fontSize: 14 },
        md: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, fontSize: 16 },
        lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, fontSize: 18 },
    };

    // Variant styles
    const getVariantStyle = (): ViewStyle => {
        const opacity = disabled || loading ? 0.5 : 1;

        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: themeColors.primary,
                    ...shadows.md,
                    opacity,
                };
            case 'secondary':
                return {
                    backgroundColor: themeColors.surface,
                    borderWidth: 2,
                    borderColor: themeColors.primary,
                    opacity,
                };
            case 'tertiary':
                return {
                    backgroundColor: themeColors.surfaceElevated,
                    opacity,
                };
            case 'ghost':
                return {
                    backgroundColor: 'transparent',
                    opacity,
                };
            default:
                return {};
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'primary':
                return theme === 'dark' ? themeColors.background : themeColors.text;
            case 'secondary':
                return themeColors.primary;
            case 'tertiary':
            case 'ghost':
                return themeColors.text;
            default:
                return themeColors.text;
        }
    };

    const config = sizeConfig[size];

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            style={[
                styles.button,
                {
                    paddingVertical: config.paddingVertical,
                    paddingHorizontal: config.paddingHorizontal,
                    borderRadius: borderRadius.md,
                    ...(fullWidth && { width: '100%' }),
                },
                getVariantStyle(),
                style,
            ]}
        >
            <Box flexDirection="row" alignItems="center" justifyContent="center" gap="sm">
                {loading && <ActivityIndicator color={getTextColor()} size="small" />}
                {!loading && icon && iconPosition === 'left' && icon}
                {!loading && (
                    <Text
                        variant="button"
                        style={{ color: getTextColor(), fontSize: config.fontSize }}
                    >
                        {children}
                    </Text>
                )}
                {!loading && icon && iconPosition === 'right' && icon}
            </Box>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
