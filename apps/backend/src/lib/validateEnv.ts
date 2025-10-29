import { logger } from './logger';

interface RequiredEnvVars {
  JWT_SECRET: string;
  DATABASE_URL: string;
  OPENAI_API_KEY: string;
}

const requiredEnvVars: (keyof RequiredEnvVars)[] = [
  'JWT_SECRET',
  'DATABASE_URL',
  'OPENAI_API_KEY',
];

export const validateEnv = (): void => {
  const missingVars: string[] = [];

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  // Validate JWT_SECRET strength
  const jwtSecret = process.env.JWT_SECRET!;
  if (jwtSecret === 'your-secret-key' || jwtSecret === 'dev-secret-key-change-in-production') {
    const warningMessage = 'Using default JWT_SECRET is insecure! Please set a strong secret.';
    if (process.env.NODE_ENV === 'production') {
      logger.error(warningMessage);
      throw new Error(warningMessage);
    } else {
      logger.warn(warningMessage);
    }
  }

  if (jwtSecret.length < 32) {
    const warningMessage = 'JWT_SECRET should be at least 32 characters long for security';
    if (process.env.NODE_ENV === 'production') {
      logger.error(warningMessage);
      throw new Error(warningMessage);
    } else {
      logger.warn(warningMessage);
    }
  }

  logger.info('✓ All required environment variables are set');
};

