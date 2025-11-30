/**
 * Session Store
 * Manages mirror sessions and chat state with MMKV persistence
 */

import { create } from 'zustand';
import { storageHelpers, STORAGE_KEYS } from '../services/storage';
import type { MirrorSession, Message, SessionState } from '../types';

interface SessionStore extends SessionState {
    startSession: () => void;
    endSession: () => void;
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
    loadHistory: () => void;
    clearHistory: () => void;
    setEmotionalInsights: (insights: string[]) => void;
    setSummary: (summary: string) => void;
}

const defaultState: SessionState = {
    currentSession: null,
    sessionHistory: [],
    isActive: false,
};

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useSessionStore = create<SessionStore>((set, get) => ({
    ...defaultState,

    startSession: () => {
        const newSession: MirrorSession = {
            id: generateId(),
            startTime: Date.now(),
            messages: [],
        };

        storageHelpers.setItem(STORAGE_KEYS.CURRENT_SESSION, newSession);
        set({ currentSession: newSession, isActive: true });
    },

    endSession: () => {
        const { currentSession, sessionHistory } = get();
        if (!currentSession) return;

        const endedSession: MirrorSession = {
            ...currentSession,
            endTime: Date.now(),
            duration: Date.now() - currentSession.startTime,
        };

        // Add to history
        const updatedHistory = [endedSession, ...sessionHistory];
        storageHelpers.setItem(STORAGE_KEYS.SESSIONS, updatedHistory);
        storageHelpers.removeItem(STORAGE_KEYS.CURRENT_SESSION);

        set({
            currentSession: null,
            isActive: false,
            sessionHistory: updatedHistory,
        });
    },

    addMessage: (messageData) => {
        const { currentSession } = get();
        if (!currentSession) return;

        const newMessage: Message = {
            ...messageData,
            id: generateId(),
            timestamp: Date.now(),
        };

        const updatedSession: MirrorSession = {
            ...currentSession,
            messages: [...currentSession.messages, newMessage],
        };

        storageHelpers.setItem(STORAGE_KEYS.CURRENT_SESSION, updatedSession);
        set({ currentSession: updatedSession });
    },

    loadHistory: () => {
        const history = storageHelpers.getItem<MirrorSession[]>(STORAGE_KEYS.SESSIONS);
        if (history) {
            set({ sessionHistory: history });
        }
    },

    clearHistory: () => {
        storageHelpers.removeItem(STORAGE_KEYS.SESSIONS);
        set({ sessionHistory: [] });
    },

    setEmotionalInsights: (insights) => {
        const { currentSession } = get();
        if (!currentSession) return;

        const updatedSession = { ...currentSession, emotionalInsights: insights };
        storageHelpers.setItem(STORAGE_KEYS.CURRENT_SESSION, updatedSession);
        set({ currentSession: updatedSession });
    },

    setSummary: (summary) => {
        const { currentSession } = get();
        if (!currentSession) return;

        const updatedSession = { ...currentSession, summary };
        storageHelpers.setItem(STORAGE_KEYS.CURRENT_SESSION, updatedSession);
        set({ currentSession: updatedSession });
    },
}));
