/**
 * Settings Store
 * Manages user preferences with MMKV persistence
 */

import { create } from 'zustand';
import { storageHelpers, STORAGE_KEYS } from '../services/storage';
import type { UserSettings } from '../types';

interface SettingsStore extends UserSettings {
    updateSettings: (settings: Partial<UserSettings>) => void;
    resetSettings: () => void;
    toggleAIVoice: () => void;
    toggleHaptic: () => void;
}

const defaultSettings: UserSettings = {
    theme: 'dark',
    aiVoiceEnabled: true,
    hapticEnabled: true,
    language: 'en',
};

// Load initial settings from storage
const getInitialSettings = (): UserSettings => {
    const stored = storageHelpers.getItem<UserSettings>(STORAGE_KEYS.SETTINGS);
    return stored || defaultSettings;
};

export const useSettingsStore = create<SettingsStore>((set) => ({
    ...getInitialSettings(),

    updateSettings: (newSettings) => set((state) => {
        const updated = { ...state, ...newSettings };
        // Save to MMKV
        storageHelpers.setItem(STORAGE_KEYS.SETTINGS, {
            theme: updated.theme,
            aiVoiceEnabled: updated.aiVoiceEnabled,
            hapticEnabled: updated.hapticEnabled,
            language: updated.language,
        });
        return updated;
    }),

    resetSettings: () => {
        storageHelpers.setItem(STORAGE_KEYS.SETTINGS, defaultSettings);
        set(defaultSettings);
    },

    toggleAIVoice: () => set((state) => {
        const aiVoiceEnabled = !state.aiVoiceEnabled;
        const updated = { ...state, aiVoiceEnabled };
        storageHelpers.setItem(STORAGE_KEYS.SETTINGS, {
            theme: updated.theme,
            aiVoiceEnabled: updated.aiVoiceEnabled,
            hapticEnabled: updated.hapticEnabled,
            language: updated.language,
        });
        return { aiVoiceEnabled };
    }),

    toggleHaptic: () => set((state) => {
        const hapticEnabled = !state.hapticEnabled;
        const updated = { ...state, hapticEnabled };
        storageHelpers.setItem(STORAGE_KEYS.SETTINGS, {
            theme: updated.theme,
            aiVoiceEnabled: updated.aiVoiceEnabled,
            hapticEnabled: updated.hapticEnabled,
            language: updated.language,
        });
        return { hapticEnabled };
    }),
}));
