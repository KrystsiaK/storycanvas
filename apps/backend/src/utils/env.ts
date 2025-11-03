import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment variable validation and export
 * Ensures all required env vars are present at startup
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
] as const;

const optionalEnvVars = [
  'PORT',
  'NODE_ENV',
  'JWT_EXPIRES_IN',
  'OPENAI_API_KEY',
  'REDIS_URL',
  'RABBITMQ_URL',
  'ALLOWED_ORIGINS',
  'LOG_LEVEL',
] as const;

/**
 * Validate required environment variables
 */
export const validateEnv = (): void => {
  const missing: string[] = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please check your .env file and ensure all required variables are set.`
    );
  }

  // Additional validation for JWT_SECRET length
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long for security');
  }
};

/**
 * Type-safe environment configuration
 */
export const env = {
  // Required
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  
  // Optional with defaults
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:19006'],
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  API_VERSION: process.env.API_VERSION || 'v1',
} as const;


