/**
 * Type definitions for MirrorMe
 */

export interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: number;
    isVoice?: boolean;
}

export interface MirrorSession {
    id: string;
    startTime: number;
    endTime?: number;
    messages: Message[];
    emotionalInsights?: string[];
    summary?: string;
    duration?: number;
}

export interface UserSettings {
    theme: 'light' | 'dark';
    aiVoiceEnabled: boolean;
    hapticEnabled: boolean;
    language: string;
}

export interface OnboardingState {
    completed: boolean;
    currentStep: number;
    skipped: boolean;
}

export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    isTyping: boolean;
}

export interface SessionState {
    currentSession: MirrorSession | null;
    sessionHistory: MirrorSession[];
    isActive: boolean;
}

// Navigation types
export type RootStackParamList = {
    Onboarding: undefined;
    Home: undefined;
    MirrorSession: undefined;
    AIChat: undefined;
    Settings: undefined;
    SessionSummary: { sessionId: string };
};

// OpenAI types
export interface AIResponse {
    content: string;
    emotionalTone?: string;
    suggestions?: string[];
}

export interface VoiceConfig {
    enabled: boolean;
    voice: string;
    speed: number;
    pitch: number;
}
