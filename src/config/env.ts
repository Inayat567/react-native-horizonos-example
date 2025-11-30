/**
 * Environment Configuration
 * Store your environment variables here
 */

export const ENV = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  APP_NAME: 'MirrorMe',
  APP_VERSION: '1.0.0',
} as const;
