/**
 * Onboarding Store
 * Manages onboarding flow state with MMKV persistence
 */

import { create } from 'zustand';
import { storageHelpers, STORAGE_KEYS } from '../services/storage';
import type { OnboardingState } from '../types';

interface OnboardingStore extends OnboardingState {
    completeOnboarding: () => void;
    resetOnboarding: () => void;
    setCurrentStep: (step: number) => void;
    skipOnboarding: () => void;
}

const defaultState: OnboardingState = {
    completed: false,
    currentStep: 0,
    skipped: false,
};

// Load initial state from storage
const getInitialState = (): OnboardingState => {
    const stored = storageHelpers.getItem<OnboardingState>(STORAGE_KEYS.ONBOARDING);
    return stored || defaultState;
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
    ...getInitialState(),

    completeOnboarding: () => {
        const state: OnboardingState = { completed: true, currentStep: 0, skipped: false };
        storageHelpers.setItem(STORAGE_KEYS.ONBOARDING, state);
        set(state);
    },

    resetOnboarding: () => {
        storageHelpers.setItem(STORAGE_KEYS.ONBOARDING, defaultState);
        set(defaultState);
    },

    setCurrentStep: (step) => set((state) => {
        const newState = { ...state, currentStep: step };
        storageHelpers.setItem(STORAGE_KEYS.ONBOARDING, newState);
        return newState;
    }),

    skipOnboarding: () => {
        const state: OnboardingState = { completed: true, currentStep: 0, skipped: true };
        storageHelpers.setItem(STORAGE_KEYS.ONBOARDING, state);
        set(state);
    },
}));
