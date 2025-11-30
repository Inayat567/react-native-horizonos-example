/**
 * Input Component
 * Theme-aware text input with VR optimization
 */

import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View } from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { colors, spacing, borderRadius, typography } from '../../theme/theme';
import { Text } from './Text';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    leftIcon,
    rightIcon,
    style,
    ...props
}) => {
    const theme = useThemeStore(state => state.theme);
    const themeColors = colors[theme];

    return (
        <View style={styles.container}>
            {label && (
                <Text variant="label" color="textSecondary" style={styles.label}>
                    {label}
                </Text>
            )}

            <View
                style={[
                    styles.inputContainer,
                    {
                        backgroundColor: themeColors.surface,
                        borderColor: error ? themeColors.error : themeColors.border,
                        borderWidth: 2,
                        borderRadius: borderRadius.md,
                    },
                ]}
            >
                {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

                <TextInput
                    style={[
                        styles.input,
                        {
                            color: themeColors.text,
                            ...typography.bodyLarge,
                        },
                        style,
                    ]}
                    placeholderTextColor={themeColors.textTertiary}
                    {...props}
                />

                {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
            </View>

            {error && (
                <Text variant="caption" color="error" style={styles.error}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    label: {
        marginBottom: spacing.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
    },
    input: {
        flex: 1,
        paddingVertical: spacing.md,
        minHeight: 52, // VR-friendly touch target
    },
    leftIcon: {
        marginRight: spacing.sm,
    },
    rightIcon: {
        marginLeft: spacing.sm,
    },
    error: {
        marginTop: spacing.xs,
    },
});
