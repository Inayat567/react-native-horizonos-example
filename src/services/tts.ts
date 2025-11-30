/**
 * Text-to-Speech Service
 * Handles AI voice responses
 */

import Speech from '@mhpdev/react-native-speech';

class TTSService {
    private initialized = false;

    async initialize(): Promise<void> {
        if (this.initialized) return;

        try {
            // Set default voice settings
            Speech.initialize({
                language: 'en-US',
                rate: 0.5,
                pitch: 1.0,
            });

            this.initialized = true;
        } catch (error) {
            console.error('TTS initialization error:', error);
        }
    }

    async speak(text: string): Promise<void> {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            await Speech.speak(text);
        } catch (error) {
            console.error('TTS speak error:', error);
        }
    }

    async stop(): Promise<void> {
        try {
            await Speech.stop();
        } catch (error) {
            console.error('TTS stop error:', error);
        }
    }

    async getVoices(): Promise<any[]> {
        try {
            const voices = await Speech.getAvailableVoices();
            return voices;
        } catch (error) {
            console.error('TTS get voices error:', error);
            return [];
        }
    }
}

export const ttsService = new TTSService();
