/**
 * AI Chat Screen
 * Conversational interface with AI companion
 */

import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Box, Text, Button, Input } from '../components/ui';
import { useThemeStore } from '../stores/themeStore';
import { useSettingsStore } from '../stores/settingsStore';
import { colors, spacing, borderRadius } from '../theme/theme';
import { haptics } from '../utils/haptics';
import { openAIService } from '../services/openai';
import { ttsService } from '../services/tts';
import type { Message } from '../types';

export const AIChatScreen: React.FC = () => {
    const navigation = useNavigation();
    const theme = useThemeStore(state => state.theme);
    const aiVoiceEnabled = useSettingsStore(state => state.aiVoiceEnabled);
    const themeColors = colors[theme];

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: 'Hello! I\'m here to listen and support you. What\'s on your mind today?',
            role: 'assistant',
            timestamp: Date.now(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        // Initialize TTS
        ttsService.initialize();
    }, []);

    const scrollToBottom = () => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: inputText.trim(),
            role: 'user',
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);
        setIsTyping(true);
        haptics.light();
        scrollToBottom();

        try {
            // Prepare conversation history
            const history = messages.map(msg => ({
                role: msg.role,
                content: msg.content,
            }));

            // Get AI response
            const response = await openAIService.getChatResponse(userMessage.content, history);

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: response,
                role: 'assistant',
                timestamp: Date.now(),
            };

            setMessages(prev => [...prev, aiMessage]);

            // Speak response if enabled
            if (aiVoiceEnabled) {
                await ttsService.speak(response);
            }

            scrollToBottom();
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: 'I\'m having trouble responding right now. Please try again.',
                role: 'assistant',
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setIsTyping(false);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.role === 'user';

        return (
            <Box
                px="xl"
                py="xs"
                flexDirection="row"
                justifyContent={isUser ? 'flex-end' : 'flex-start'}
            >
                <Box
                    maxWidth="75%"
                    bg={isUser ? 'primary' : 'surface'}
                    radius="lg"
                    p="md"
                    style={{
                        ...(isUser && { borderBottomRightRadius: 4 }),
                        ...(!isUser && { borderBottomLeftRadius: 4 }),
                    }}
                >
                    <Text
                        variant="bodyMedium"
                        color={isUser ? (theme === 'dark' ? 'background' : 'text') : 'text'}
                        style={styles.messageText}
                    >
                        {item.content}
                    </Text>
                </Box>
            </Box>
        );
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: themeColors.background }]}
            edges={['top']}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={90}
            >
                {/* Header */}
                <Box
                    px="xl"
                    py="md"
                    bg="surface"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    style={styles.header}
                >
                    <Box flexDirection="row" alignItems="center" gap="md">
                        <Button variant="ghost" onPress={() => navigation.goBack()}>
                            ← Back
                        </Button>
                        <Box>
                            <Text variant="h3" weight="600">
                                AI Chat
                            </Text>
                            <Text variant="caption" color="textSecondary">
                                {isTyping ? 'Typing...' : 'Online'}
                            </Text>
                        </Box>
                    </Box>

                    <Text style={styles.avatar}>🤖</Text>
                </Box>

                {/* Messages */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.messageList}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={scrollToBottom}
                />

                {/* Typing Indicator */}
                {isTyping && (
                    <Box px="xl" py="xs">
                        <Box bg="surface" radius="lg" p="md" style={{ alignSelf: 'flex-start' }}>
                            <Box flexDirection="row" gap="xs" alignItems="center">
                                <Box width={8} height={8} radius="full" bg="textTertiary" />
                                <Box width={8} height={8} radius="full" bg="textTertiary" />
                                <Box width={8} height={8} radius="full" bg="textTertiary" />
                            </Box>
                        </Box>
                    </Box>
                )}

                {/* Input */}
                <Box
                    px="xl"
                    py="md"
                    bg="surface"
                    style={styles.inputContainer}
                >
                    <Box flexDirection="row" gap="sm" alignItems="flex-end">
                        <Box flex={1}>
                            <Input
                                placeholder="Type your message..."
                                value={inputText}
                                onChangeText={setInputText}
                                multiline
                                maxLength={500}
                                style={styles.input}
                                onSubmitEditing={handleSend}
                            />
                        </Box>

                        <Button
                            variant={inputText.trim() ? 'primary' : 'tertiary'}
                            onPress={handleSend}
                            disabled={!inputText.trim() || isLoading}
                            loading={isLoading}
                            style={styles.sendButton}
                        >
                            {isLoading ? '' : '→'}
                        </Button>
                    </Box>
                </Box>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    avatar: {
        fontSize: 32,
    },
    messageList: {
        paddingVertical: spacing.md,
        paddingBottom: spacing.xl,
    },
    messageText: {
        lineHeight: 22,
    },
    inputContainer: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    input: {
        maxHeight: 100,
    },
    sendButton: {
        width: 52,
        height: 52,
        borderRadius: borderRadius.full,
        padding: 0,
    },
});
