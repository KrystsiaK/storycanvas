import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { validateEnv } from '../env';

describe('Environment Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should pass validation with all required variables', () => {
    process.env.DATABASE_URL = 'postgresql://localhost:5432/test';
    process.env.JWT_SECRET = 'this-is-a-very-secure-secret-key-that-is-long-enough';

    expect(() => validateEnv()).not.toThrow();
  });

  it('should throw error when DATABASE_URL is missing', () => {
    delete process.env.DATABASE_URL;
    process.env.JWT_SECRET = 'this-is-a-very-secure-secret-key-that-is-long-enough';

    expect(() => validateEnv()).toThrow('Missing required environment variables: DATABASE_URL');
  });

  it('should throw error when JWT_SECRET is missing', () => {
    process.env.DATABASE_URL = 'postgresql://localhost:5432/test';
    delete process.env.JWT_SECRET;

    expect(() => validateEnv()).toThrow('Missing required environment variables: JWT_SECRET');
  });

  it('should throw error when JWT_SECRET is too short', () => {
    process.env.DATABASE_URL = 'postgresql://localhost:5432/test';
    process.env.JWT_SECRET = 'short';

    expect(() => validateEnv()).toThrow('JWT_SECRET must be at least 32 characters long');
  });

  it('should throw error when multiple variables are missing', () => {
    delete process.env.DATABASE_URL;
    delete process.env.JWT_SECRET;

    expect(() => validateEnv()).toThrow('DATABASE_URL, JWT_SECRET');
  });
});


