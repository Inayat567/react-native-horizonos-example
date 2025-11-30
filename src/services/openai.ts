/**
 * OpenAI Service
 * Handles AI interactions for coaching and emotional reflection
 */

import OpenAI from 'openai';
import { ENV } from '../config/env';
import type { AIResponse } from '../types';

class OpenAIService {
    private client: OpenAI;

    constructor() {
        this.client = new OpenAI({
            apiKey: ENV.OPENAI_API_KEY,
        });
    }

    /**
     * Get AI coaching response for mirror session
     */
    async getMirrorResponse(userMessage: string, conversationHistory: { role: string; content: string }[] = []): Promise<AIResponse> {
        try {
            const systemPrompt = `You are MirrorMe, an empathetic AI coach focused on self-reflection and emotional growth. 
Your role is to:
1. Listen deeply and understand the user's emotional state
2. Reflect back their feelings with compassion
3. Ask thoughtful questions that promote self-awareness
4. Provide gentle, motivational guidance
5. Be concise yet meaningful (2-3 sentences)
6. Use warm, supportive language

Be like a wise, caring friend who helps people see themselves more clearly.`;

            const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
                { role: 'system', content: systemPrompt },
                ...conversationHistory.map(msg => ({
                    role: msg.role as 'user' | 'assistant',
                    content: msg.content,
                })),
                { role: 'user', content: userMessage },
            ];

            const completion = await this.client.chat.completions.create({
                model: 'gpt-4o-mini',
                messages,
                temperature: 0.7,
                max_tokens: 150,
            });

            const content = completion.choices[0]?.message?.content || 'I\'m here to listen.';

            return {
                content,
                emotionalTone: this.detectEmotionalTone(userMessage),
            };
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw new Error('Failed to get AI response');
        }
    }

    /**
     * Get AI chat response
     */
    async getChatResponse(userMessage: string, conversationHistory: { role: string; content: string }[] = []): Promise<string> {
        try {
            const systemPrompt = `You are MirrorMe, a supportive AI companion for personal growth and self-reflection. 
Engage in meaningful conversation, ask insightful questions, and help users explore their thoughts and feelings.
Be warm, empathetic, and encouraging.`;

            const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
                { role: 'system', content: systemPrompt },
                ...conversationHistory.map(msg => ({
                    role: msg.role as 'user' | 'assistant',
                    content: msg.content,
                })),
                { role: 'user', content: userMessage },
            ];

            const completion = await this.client.chat.completions.create({
                model: 'gpt-4o-mini',
                messages,
                temperature: 0.8,
                max_tokens: 250,
            });

            return completion.choices[0]?.message?.content || 'I\'m here to chat!';
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw new Error('Failed to get AI response');
        }
    }

    /**
     * Generate session summary
     */
    async generateSessionSummary(messages: { role: string; content: string }[]): Promise<string> {
        try {
            const conversationText = messages
                .map(msg => `${msg.role}: ${msg.content}`)
                .join('\n');

            const prompt = `Summarize this self-reflection conversation in 2-3 sentences. Highlight key insights and emotional themes:\n\n${conversationText}`;

            const completion = await this.client.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.5,
                max_tokens: 120,
            });

            return completion.choices[0]?.message?.content || 'Session completed';
        } catch (error) {
            console.error('Summary generation error:', error);
            return 'Unable to generate summary at this time.';
        }
    }

    /**
     * Detect emotional tone from text
     */
    private detectEmotionalTone(text: string): string {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('happy') || lowerText.includes('great') || lowerText.includes('excited')) {
            return 'positive';
        } else if (lowerText.includes('sad') || lowerText.includes('down') || lowerText.includes('depressed')) {
            return 'sad';
        } else if (lowerText.includes('angry') || lowerText.includes('frustrated') || lowerText.includes('annoyed')) {
            return 'angry';
        } else if (lowerText.includes('anxious') || lowerText.includes('worried') || lowerText.includes('nervous')) {
            return 'anxious';
        }

        return 'neutral';
    }
}

export const openAIService = new OpenAIService();
