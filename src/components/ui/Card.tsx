/**
 * Card Component
 * Elevated container with interactive capabilities
 */

import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import { Box } from './Box';
import { useThemeStore } from '../../stores/themeStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { haptics } from '../../utils/haptics';

interface CardProps {
    children: React.ReactNode;
    onPress?: () => void;
    style?: ViewStyle;
    elevated?: boolean;
    transparent?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    onPress,
    style,
    elevated = true,
    transparent = false,
}) => {
    const theme = useThemeStore(state => state.theme);
    const hapticEnabled = useSettingsStore(state => state.hapticEnabled);

    const handlePress = () => {
        if (!onPress) return;
        if (hapticEnabled) haptics.light();
        onPress();
    };

    const content = (
        <Box
            bg={transparent ? undefined : elevated ? 'surfaceElevated' : 'surface'}
            radius="lg"
            p="lg"
            shadow={elevated ? 'lg' : undefined}
            style={style}
        >
            {children}
        </Box>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
};
