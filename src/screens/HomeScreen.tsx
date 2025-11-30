/**
 * Home Screen
 * Main dashboard with Mirror Session and AI Chat entry points
 */

import React, { useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Box, Text, Card, Button } from '../components/ui';
import { useThemeStore } from '../stores/themeStore';
import { useSessionStore } from '../stores/sessionStore';
import { colors, spacing } from '../theme/theme';
import { haptics } from '../utils/haptics';

export const HomeScreen: React.FC = () => {
    const navigation = useNavigation();
    const theme = useThemeStore(state => state.theme);
    const sessionHistory = useSessionStore(state => state.sessionHistory);
    const loadHistory = useSessionStore(state => state.loadHistory);
    const themeColors = colors[theme];

    useEffect(() => {
        loadHistory();
    }, []);

    const handleMirrorSession = () => {
        haptics.medium();
        navigation.navigate('MirrorSession' as never);
    };

    const handleAIChat = () => {
        haptics.medium();
        navigation.navigate('AIChat' as never);
    };

    const handleSettings = () => {
        haptics.light();
        navigation.navigate('Settings' as never);
    };

    const totalSessions = sessionHistory.length;
    const lastSessionDate = sessionHistory[0]
        ? new Date(sessionHistory[0].startTime).toLocaleDateString()
        : 'No sessions yet';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <Box px="xl" pt="xl" pb="lg">
                    <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Text variant="displayMedium" weight="700">
                                MirrorMe
                            </Text>
                            <Text variant="bodyMedium" color="textSecondary">
                                Your Journey of Self-Discovery
                            </Text>
                        </Box>

                        <Button variant="ghost" onPress={handleSettings}>
                            ⚙️
                        </Button>
                    </Box>
                </Box>

                {/* Stats Card */}
                <Box px="xl" mb="lg">
                    <Card elevated>
                        <Box flexDirection="row" justifyContent="space-around">
                            <Box alignItems="center">
                                <Text variant="h2" color="primary" weight="700">
                                    {totalSessions}
                                </Text>
                                <Text variant="bodySmall" color="textSecondary">
                                    Sessions
                                </Text>
                            </Box>

                            <Box width={1} bg="border" />

                            <Box alignItems="center" flex={1} ml="md">
                                <Text variant="caption" color="textSecondary">
                                    Last Session
                                </Text>
                                <Text variant="bodySmall" color="text" align="center">
                                    {lastSessionDate}
                                </Text>
                            </Box>
                        </Box>
                    </Card>
                </Box>

                {/* Mirror Session Card */}
                <Box px="xl" mb="md">
                    <Card onPress={handleMirrorSession} elevated>
                        <Box gap="md">
                            <Box
                                width={56}
                                height={56}
                                radius="md"
                                bg="primary"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Text style={styles.cardEmoji}>🪞</Text>
                            </Box>

                            <Box>
                                <Text variant="h3" weight="600" style={styles.cardTitle}>
                                    Start Mirror Session
                                </Text>
                                <Text variant="bodyMedium" color="textSecondary" style={styles.cardDescription}>
                                    Face yourself and reflect with AI guidance through voice or text
                                </Text>
                            </Box>

                            <Box
                                flexDirection="row"
                                alignItems="center"
                                gap="xs"
                                style={styles.cardFooter}
                            >
                                <Text variant="label" color="primary" weight="600">
                                    Begin Session
                                </Text>
                                <Text variant="label" color="primary">
                                    →
                                </Text>
                            </Box>
                        </Box>
                    </Card>
                </Box>

                {/* AI Chat Card */}
                <Box px="xl" mb="xl">
                    <Card onPress={handleAIChat} elevated>
                        <Box gap="md">
                            <Box
                                width={56}
                                height={56}
                                radius="md"
                                bg="secondary"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Text style={styles.cardEmoji}>💬</Text>
                            </Box>

                            <Box>
                                <Text variant="h3" weight="600" style={styles.cardTitle}>
                                    AI Chat
                                </Text>
                                <Text variant="bodyMedium" color="textSecondary" style={styles.cardDescription}>
                                    Have a thoughtful conversation with your AI companion
                                </Text>
                            </Box>

                            <Box
                                flexDirection="row"
                                alignItems="center"
                                gap="xs"
                                style={styles.cardFooter}
                            >
                                <Text variant="label" color="secondary" weight="600">
                                    Start Chatting
                                </Text>
                                <Text variant="label" color="secondary">
                                    →
                                </Text>
                            </Box>
                        </Box>
                    </Card>
                </Box>

                {/* Motivational Quote */}
                <Box px="xl" mb="xl">
                    <Box
                        bg="surfaceElevated"
                        radius="lg"
                        p="lg"
                        style={{ borderLeftWidth: 4, borderLeftColor: themeColors.accent }}
                    >
                        <Text variant="bodyMedium" color="text" style={styles.quote}>
                            "The privilege of a lifetime is to become who you truly are."
                        </Text>
                        <Text variant="caption" color="textSecondary" style={styles.quoteAuthor}>
                            — Carl Jung
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
    cardEmoji: {
        fontSize: 28,
    },
    cardTitle: {
        marginBottom: spacing.xs,
    },
    cardDescription: {
        lineHeight: 22,
    },
    cardFooter: {
        marginTop: spacing.xs,
    },
    quote: {
        fontStyle: 'italic',
        marginBottom: spacing.xs,
        lineHeight: 24,
    },
    quoteAuthor: {
        textAlign: 'right',
    },
});
