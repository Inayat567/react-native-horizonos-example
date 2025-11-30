/**
 * Haptic Feedback Utility
 * Provides tactile feedback for VR interactions
 */

import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
};

export const haptics = {
    /**
     * Light impact - for subtle interactions
     */
    light: () => {
        ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
    },

    /**
     * Medium impact - for button presses
     */
    medium: () => {
        ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);
    },

    /**
     * Heavy impact - for important actions
     */
    heavy: () => {
        ReactNativeHapticFeedback.trigger('impactHeavy', hapticOptions);
    },

    /**
     * Success feedback
     */
    success: () => {
        ReactNativeHapticFeedback.trigger('notificationSuccess', hapticOptions);
    },

    /**
     * Warning feedback
     */
    warning: () => {
        ReactNativeHapticFeedback.trigger('notificationWarning', hapticOptions);
    },

    /**
     * Error feedback
     */
    error: () => {
        ReactNativeHapticFeedback.trigger('notificationError', hapticOptions);
    },

    /**
     * Selection feedback - for scrolling/swiping
     */
    selection: () => {
        ReactNativeHapticFeedback.trigger('selection', hapticOptions);
    },
};
