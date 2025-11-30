/**
 * Onboarding Screen
 * Welcome flow introducing MirrorMe features
 */

import React, { useState } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Box, Text, Button } from '../components/ui';
import { useOnboardingStore } from '../stores/onboardingStore';
import { useThemeStore } from '../stores/themeStore';
import { colors, spacing } from '../theme/theme';
import { haptics } from '../utils/haptics';

const { width } = Dimensions.get('window');

const onboardingSteps = [
    {
        title: 'Welcome to MirrorMe',
        description: 'Your AI-powered companion for self-reflection and personal growth. Discover deeper insights about yourself.',
        emoji: '✨',
    },
    {
        title: 'Mirror Session',
        description: 'Face yourself through your camera and engage in meaningful AI-guided reflection. Voice or text - your choice.',
        emoji: '🪞',
    },
    {
        title: 'AI Chat',
        description: 'Have thoughtful conversations anytime. Your AI coach is here to listen, understand, and support your journey.',
        emoji: '💬',
    },
    {
        title: 'Privacy First',
        description: 'Your conversations stay on your device. We respect your privacy and keep your reflections secure.',
        emoji: '🔒',
    },
];

export const OnboardingScreen: React.FC = () => {
    const navigation = useNavigation();
    const theme = useThemeStore(state => state.theme);
    const completeOnboarding = useOnboardingStore(state => state.completeOnboarding);
    const skipOnboarding = useOnboardingStore(state => state.skipOnboarding);
    const themeColors = colors[theme];

    const [currentStep, setCurrentStep] = useState(0);
    const progress = useSharedValue(0);

    const isLastStep = currentStep === onboardingSteps.length - 1;
    const currentData = onboardingSteps[currentStep];

    const handleNext = () => {
        if (isLastStep) {
            completeOnboarding();
            haptics.success();
            navigation.navigate('Home' as never);
        } else {
            setCurrentStep(prev => prev + 1);
            progress.value = withTiming((currentStep + 1) / onboardingSteps.length);
            haptics.light();
        }
    };

    const handleSkip = () => {
        skipOnboarding();
        navigation.navigate('Home' as never);
    };

    // Animated styles for progress bar
    const progressStyle = useAnimatedStyle(() => {
        return {
            width: `${interpolate(
                progress.value,
                [0, 1],
                [0, 100]
            )}%`,
        };
    });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
            <Box flex={1} p="xl">
                {/* Progress Bar */}
                <Box mb="xxl">
                    <Box
                        height={4}
                        bg="border"
                        radius="full"
                        style={{ overflow: 'hidden' }}
                    >
                        <Animated.View
                            style={[
                                styles.progressBar,
                                { backgroundColor: themeColors.primary },
                                progressStyle,
                            ]}
                        />
                    </Box>
                </Box>

                {/* Content */}
                <Box flex={1} justifyContent="center" alignItems="center" px="lg">
                    <Text style={styles.emoji}>{currentData.emoji}</Text>

                    <Text variant="h1" align="center" style={styles.title}>
                        {currentData.title}
                    </Text>

                    <Text
                        variant="bodyLarge"
                        color="textSecondary"
                        align="center"
                        style={styles.description}
                    >
                        {currentData.description}
                    </Text>
                </Box>

                {/* Navigation */}
                <Box gap="md">
                    <Button
                        size="lg"
                        variant="primary"
                        onPress={handleNext}
                        fullWidth
                    >
                        {isLastStep ? 'Get Started' : 'Next'}
                    </Button>

                    {!isLastStep && (
                        <Button
                            size="lg"
                            variant="ghost"
                            onPress={handleSkip}
                            fullWidth
                        >
                            Skip
                        </Button>
                    )}
                </Box>

                {/* Step Indicator */}
                <Box flexDirection="row" justifyContent="center" gap="sm" mt="lg">
                    {onboardingSteps.map((_, index) => (
                        <Box
                            key={index}
                            width={8}
                            height={8}
                            radius="full"
                            bg={index === currentStep ? 'primary' : 'border'}
                        />
                    ))}
                </Box>
            </Box>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    progressBar: {
        height: '100%',
        borderRadius: 999,
    },
    emoji: {
        fontSize: 80,
        marginBottom: spacing.xl,
    },
    title: {
        marginBottom: spacing.md,
    },
    description: {
        marginBottom: spacing.xxl,
        lineHeight: 28,
    },
});
