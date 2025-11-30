/**
 * Mirror Session Screen
 * Camera-based AI reflection session
 */

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
// import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { Box, Text, Button, Input } from '../components/ui';
import { useThemeStore } from '../stores/themeStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useSessionStore } from '../stores/sessionStore';
import { colors, spacing, borderRadius } from '../theme/theme';
import { haptics } from '../utils/haptics';
import { openAIService } from '../services/openai';
import { ttsService } from '../services/tts';

const { width, height } = Dimensions.get('window');

export const MirrorSessionScreen: React.FC = () => {
    const navigation = useNavigation();
    const theme = useThemeStore(state => state.theme);
    const aiVoiceEnabled = useSettingsStore(state => state.aiVoiceEnabled);
    const themeColors = colors[theme];

    const startSession = useSessionStore(state => state.startSession);
    const endSession = useSessionStore(state => state.endSession);
    const addMessage = useSessionStore(state => state.addMessage);
    const currentSession = useSessionStore(state => state.currentSession);
    const isActive = useSessionStore(state => state.isActive);

    // const { hasPermission, requestPermission } = useCameraPermission();
    // const device = useCameraDevice('front');
    const hasPermission = true;
    const requestPermission = async () => true;
    const device = true;

    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lastAIResponse, setLastAIResponse] = useState('');
    const [showingResponse, setShowingResponse] = useState(false);

    useEffect(() => {
        // Request camera permission
        if (!hasPermission) {
            requestPermission();
        }

        // Initialize TTS
        ttsService.initialize();

        // Start session
        if (!isActive) {
            startSession();
        }

        return () => {
            // Cleanup
            if (isActive) {
                endSession();
            }
            ttsService.stop();
        };
    }, []);

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        const userInput = inputText.trim();
        setInputText('');
        setIsLoading(true);
        haptics.light();

        // Add user message to session
        addMessage({
            content: userInput,
            role: 'user',
        });

        try {
            // Prepare conversation history
            const history = currentSession?.messages.map(msg => ({
                role: msg.role,
                content: msg.content,
            })) || [];

            // Get AI response
            const response = await openAIService.getMirrorResponse(userInput, history);

            // Add AI message to session
            addMessage({
                content: response.content,
                role: 'assistant',
            });

            setLastAIResponse(response.content);
            setShowingResponse(true);

            // Speak response if enabled
            if (aiVoiceEnabled) {
                await ttsService.speak(response.content);
            }

            // Hide response after 8 seconds
            setTimeout(() => {
                setShowingResponse(false);
            }, 8000);

        } catch (error) {
            console.error('Mirror session error:', error);
            Alert.alert('Error', 'Failed to get AI response. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEndSession = () => {
        Alert.alert(
            'End Session',
            'Are you ready to end your reflection session?',
            [
                { text: 'Continue', style: 'cancel' },
                {
                    text: 'End',
                    style: 'destructive',
                    onPress: async () => {
                        if (isActive) {
                            endSession();
                        }
                        await ttsService.stop();
                        haptics.success();
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    if (!hasPermission) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
                <Box flex={1} justifyContent="center" alignItems="center" px="xl">
                    <Text variant="h2" align="center" style={styles.permissionTitle}>
                        Camera Permission Required
                    </Text>
                    <Text variant="bodyLarge" color="textSecondary" align="center" style={styles.permissionText}>
                        MirrorMe needs access to your camera for the mirror session experience.
                    </Text>
                    <Button variant="primary" size="lg" onPress={requestPermission} style={styles.permissionButton}>
                        Grant Permission
                    </Button>
                </Box>
            </SafeAreaView>
        );
    }

    if (!device) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
                <Box flex={1} justifyContent="center" alignItems="center" px="xl">
                    <Text variant="h2" align="center">
                        Camera Not Available
                    </Text>
                    <Text variant="bodyLarge" color="textSecondary" align="center" style={styles.permissionText}>
                        Please check your device camera.
                    </Text>
                </Box>
            </SafeAreaView>
        );
    }

    return (
        <Box flex={1} bg="background">
            {/* Camera View Placeholder */}
            <Box style={StyleSheet.absoluteFill} bg="surface">
                <Box flex={1} justifyContent="center" alignItems="center">
                    <Text variant="h3" align="center" style={{ color: themeColors.text }}>
                        Camera Preview
                    </Text>
                    <Text variant="bodyMedium" align="center" style={{ color: themeColors.textSecondary }}>
                        (Camera disabled for emulator build)
                    </Text>
                </Box>
            </Box>

            {/* Overlay with gradient */}
            <Box
                style={StyleSheet.absoluteFill}
                bg={theme === 'dark' ? undefined : undefined}
            >
                <Box
                    style={{
                        ...StyleSheet.absoluteFillObject,
                        backgroundColor: theme === 'dark'
                            ? 'rgba(15, 23, 42, 0.4)'
                            : 'rgba(255, 255, 255, 0.3)',
                    }}
                />
            </Box>

            <SafeAreaView style={styles.content}>
                {/* Header */}
                <Box px="xl" pt="md" pb="lg">
                    <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Text variant="h2" weight="700" style={{ color: '#FFFFFF' }}>
                                Mirror Session
                            </Text>
                            <Text variant="bodyMedium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                Reflect on yourself
                            </Text>
                        </Box>

                        <TouchableOpacity onPress={handleEndSession}>
                            <Box
                                width={48}
                                height={48}
                                radius="full"
                                bg="error"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Text style={{ fontSize: 20, color: '#FFFFFF' }}>✕</Text>
                            </Box>
                        </TouchableOpacity>
                    </Box>
                </Box>

                {/* AI Response Display */}
                {showingResponse && lastAIResponse && (
                    <Box px="xl" mb="md">
                        <Box
                            bg="surfaceElevated"
                            radius="lg"
                            p="lg"
                            style={{
                                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                                borderWidth: 2,
                                borderColor: themeColors.primary,
                            }}
                        >
                            <Box flexDirection="row" gap="sm" mb="sm">
                                <Text style={{ fontSize: 24 }}>🤖</Text>
                                <Text variant="label" style={{ color: themeColors.primary }}>
                                    AI Response
                                </Text>
                            </Box>
                            <Text
                                variant="bodyLarge"
                                style={{ color: '#FFFFFF', lineHeight: 26 }}
                            >
                                {lastAIResponse}
                            </Text>
                        </Box>
                    </Box>
                )}

                {/* Spacer */}
                <Box flex={1} />

                {/* Input Area */}
                <Box px="xl" pb="xl">
                    <Box
                        bg="surface"
                        radius="xl"
                        p="md"
                        style={{
                            backgroundColor: 'rgba(30, 41, 59, 0.95)',
                        }}
                    >
                        <Input
                            placeholder="Share your thoughts..."
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            maxLength={300}
                            style={[
                                styles.mirrorInput,
                                { color: '#FFFFFF' },
                            ]}
                            placeholderTextColor="rgba(255,255,255,0.5)"
                        />

                        <Box flexDirection="row" gap="sm" mt="md">
                            <Button
                                variant="primary"
                                onPress={handleSend}
                                disabled={!inputText.trim() || isLoading}
                                loading={isLoading}
                                fullWidth
                                size="lg"
                            >
                                Send to AI
                            </Button>
                        </Box>

                        <Box mt="sm">
                            <Text
                                variant="caption"
                                align="center"
                                style={{ color: 'rgba(255,255,255,0.6)' }}
                            >
                                Messages: {currentSession?.messages.length || 0}
                            </Text>
                        </Box>
                    </Box>
                </Box>
            </SafeAreaView>
        </Box>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    permissionTitle: {
        marginBottom: spacing.md,
    },
    permissionText: {
        marginBottom: spacing.xxl,
        lineHeight: 26,
    },
    permissionButton: {
        marginTop: spacing.lg,
    },
    mirrorInput: {
        minHeight: 60,
        maxHeight: 120,
        fontSize: 16,
    },
});
