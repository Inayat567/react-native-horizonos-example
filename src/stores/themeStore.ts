/**
 * Theme Store
 * Manages light/dark theme with MMKV persistence
 */

import { create } from 'zustand';
import { storageHelpers, STORAGE_KEYS } from '../services/storage';
import type { Theme } from '../theme/theme';

interface ThemeStore {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

// Load initial theme from storage
const getInitialTheme = (): Theme => {
    const stored = storageHelpers.getItem<Theme>(STORAGE_KEYS.THEME);
    return stored || 'dark'; // Default to dark for VR
};

export const useThemeStore = create<ThemeStore>((set) => ({
    theme: getInitialTheme(),

    toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        storageHelpers.setItem(STORAGE_KEYS.THEME, newTheme);
        return { theme: newTheme };
    }),

    setTheme: (theme) => {
        storageHelpers.setItem(STORAGE_KEYS.THEME, theme);
        set({ theme });
    },
}));
