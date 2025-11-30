/**
 * Settings Screen
 * User preferences and app configuration
 */

import React from 'react';
import { StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Box, Text, Card, Button } from '../components/ui';
import { useThemeStore } from '../stores/themeStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useOnboardingStore } from '../stores/onboardingStore';
import { useSessionStore } from '../stores/sessionStore';
import { colors, spacing } from '../theme/theme';
import { haptics } from '../utils/haptics';
import { ENV } from '../config/env';

export const SettingsScreen: React.FC = () => {
    const navigation = useNavigation();
    const theme = useThemeStore(state => state.theme);
    const toggleTheme = useThemeStore(state => state.toggleTheme);
    const themeColors = colors[theme];

    const aiVoiceEnabled = useSettingsStore(state => state.aiVoiceEnabled);
    const hapticEnabled = useSettingsStore(state => state.hapticEnabled);
    const toggleAIVoice = useSettingsStore(state => state.toggleAIVoice);
    const toggleHaptic = useSettingsStore(state => state.toggleHaptic);
    const resetSettings = useSettingsStore(state => state.resetSettings);

    const resetOnboarding = useOnboardingStore(state => state.resetOnboarding);
    const clearHistory = useSessionStore(state => state.clearHistory);

    const handleThemeToggle = () => {
        toggleTheme();
        haptics.light();
    };

    const handleAIVoiceToggle = () => {
        toggleAIVoice();
        if (hapticEnabled) haptics.light();
    };

    const handleHapticToggle = () => {
        const wasEnabled = hapticEnabled;
        toggleHaptic();
        if (wasEnabled) haptics.light();
    };

    const handleResetOnboarding = () => {
        Alert.alert(
            'Reset Onboarding',
            'This will show the welcome screens again on next app start.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => {
                        resetOnboarding();
                        haptics.success();
                        Alert.alert('Success', 'Onboarding has been reset.');
                    },
                },
            ]
        );
    };

    const handleClearHistory = () => {
        Alert.alert(
            'Clear History',
            'This will permanently delete all your session history. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => {
                        clearHistory();
                        haptics.success();
                        Alert.alert('Success', 'Session history has been cleared.');
                    },
                },
            ]
        );
    };

    const handleResetAllSettings = () => {
        Alert.alert(
            'Reset All Settings',
            'This will reset all settings to default values.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => {
                        resetSettings();
                        haptics.success();
                        Alert.alert('Success', 'Settings have been reset.');
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <Box px="xl" pt="lg" pb="lg">
                    <Box flexDirection="row" alignItems="center" gap="md">
                        <Button variant="ghost" onPress={() => navigation.goBack()}>
                            ← Back
                        </Button>
                        <Text variant="h1" weight="700">
                            Settings
                        </Text>
                    </Box>
                </Box>

                {/* Appearance Section */}
                <Box px="xl" mb="md">
                    <Text variant="h3" weight="600" style={styles.sectionTitle}>
                        Appearance
                    </Text>

                    <Card>
                        <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                            <Box flex={1}>
                                <Text variant="bodyLarge" weight="500">
                                    Dark Mode
                                </Text>
                                <Text variant="bodySmall" color="textSecondary">
                                    {theme === 'dark' ? 'Enabled' : 'Disabled'}
                                </Text>
                            </Box>
                            <Switch
                                value={theme === 'dark'}
                                onValueChange={handleThemeToggle}
                                trackColor={{ false: themeColors.border, true: themeColors.primary }}
                                thumbColor={themeColors.background}
                            />
                        </Box>
                    </Card>
                </Box>

                {/* Experience Section */}
                <Box px="xl" mb="md">
                    <Text variant="h3" weight="600" style={styles.sectionTitle}>
                        Experience
                    </Text>

                    <Card>
                        <Box gap="lg">
                            {/* AI Voice */}
                            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Box flex={1}>
                                    <Text variant="bodyLarge" weight="500">
                                        AI Voice Response
                                    </Text>
                                    <Text variant="bodySmall" color="textSecondary">
                                        Hear AI responses spoken aloud
                                    </Text>
                                </Box>
                                <Switch
                                    value={aiVoiceEnabled}
                                    onValueChange={handleAIVoiceToggle}
                                    trackColor={{ false: themeColors.border, true: themeColors.primary }}
                                    thumbColor={themeColors.background}
                                />
                            </Box>

                            <Box height={1} bg="border" />

                            {/* Haptic Feedback */}
                            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Box flex={1}>
                                    <Text variant="bodyLarge" weight="500">
                                        Haptic Feedback
                                    </Text>
                                    <Text variant="bodySmall" color="textSecondary">
                                        Vibration on interactions
                                    </Text>
                                </Box>
                                <Switch
                                    value={hapticEnabled}
                                    onValueChange={handleHapticToggle}
                                    trackColor={{ false: themeColors.border, true: themeColors.primary }}
                                    thumbColor={themeColors.background}
                                />
                            </Box>
                        </Box>
                    </Card>
                </Box>

                {/* Data & Privacy Section */}
                <Box px="xl" mb="md">
                    <Text variant="h3" weight="600" style={styles.sectionTitle}>
                        Data & Privacy
                    </Text>

                    <Card>
                        <Box gap="md">
                            <Button
                                variant="secondary"
                                onPress={handleClearHistory}
                                fullWidth
                            >
                                Clear Session History
                            </Button>

                            <Button
                                variant="secondary"
                                onPress={handleResetOnboarding}
                                fullWidth
                            >
                                Reset Onboarding
                            </Button>

                            <Button
                                variant="tertiary"
                                onPress={handleResetAllSettings}
                                fullWidth
                            >
                                Reset All Settings
                            </Button>
                        </Box>
                    </Card>
                </Box>

                {/* About Section */}
                <Box px="xl" mb="xxl">
                    <Text variant="h3" weight="600" style={styles.sectionTitle}>
                        About
                    </Text>

                    <Card>
                        <Box gap="sm">
                            <Box flexDirection="row" justifyContent="space-between">
                                <Text variant="bodyMedium" color="textSecondary">
                                    App Name
                                </Text>
                                <Text variant="bodyMedium" weight="500">
                                    {ENV.APP_NAME}
                                </Text>
                            </Box>

                            <Box flexDirection="row" justifyContent="space-between">
                                <Text variant="bodyMedium" color="textSecondary">
                                    Version
                                </Text>
                                <Text variant="bodyMedium" weight="500">
                                    {ENV.APP_VERSION}
                                </Text>
                            </Box>

                            <Box flexDirection="row" justifyContent="space-between">
                                <Text variant="bodyMedium" color="textSecondary">
                                    Platform
                                </Text>
                                <Text variant="bodyMedium" weight="500">
                                    Meta Horizon OS
                                </Text>
                            </Box>
                        </Box>
                    </Card>

                    <Box mt="lg" px="md">
                        <Text variant="bodySmall" color="textSecondary" align="center" style={styles.privacyNote}>
                            Your conversations are stored locally on your device. MirrorMe respects your privacy.
                        </Text>
                    </Box>
                </Box>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xxl,
    },
    sectionTitle: {
        marginBottom: spacing.md,
    },
    privacyNote: {
        lineHeight: 20,
    },
});
