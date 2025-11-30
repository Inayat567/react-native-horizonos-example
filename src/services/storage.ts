/**
 * MMKV Storage Configuration
 * Fast, encrypted local storage for MirrorMe
 */

import { createMMKV } from 'react-native-mmkv';

// Initialize MMKV instance
export const storage = createMMKV({
    id: 'mirrorme-storage',
    encryptionKey: 'mirrorme-secure-key-2024',
});

// Storage keys
export const STORAGE_KEYS = {
    THEME: 'theme',
    SETTINGS: 'settings',
    ONBOARDING: 'onboarding',
    SESSIONS: 'sessions',
    CURRENT_SESSION: 'current_session',
    CHAT_HISTORY: 'chat_history',
} as const;

// Helper functions for typed storage
export const storageHelpers = {
    setItem: <T>(key: string, value: T): void => {
        storage.set(key, JSON.stringify(value));
    },

    getItem: <T>(key: string): T | null => {
        const value = storage.getString(key);
        return value ? JSON.parse(value) : null;
    },

    removeItem: (key: string): void => {
        storage.remove(key);
    },

    clear: (): void => {
        storage.clearAll();
    },
};
