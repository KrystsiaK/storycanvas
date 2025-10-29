// Test setup file
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only-32chars';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/storycanvas_test';
process.env.OPENAI_API_KEY = 'test-openai-key';

// Mock logger to avoid cluttering test output
jest.mock('../lib/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

