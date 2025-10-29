// E2E test setup
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only-32chars-long';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/storycanvas_test';
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.PORT = '3001';

// Mock OpenAI service for e2e tests
jest.mock('../../services/openai.service', () => ({
  OpenAIService: jest.fn().mockImplementation(() => ({
    generateStory: jest.fn().mockResolvedValue({
      title: 'Test Adventure Story',
      content: 'Once upon a time in a magical land...',
    }),
    generateCharacterImage: jest.fn().mockResolvedValue('https://example.com/image.png'),
  })),
}));

beforeAll(async () => {
  // Could setup test database here if needed
});

afterAll(async () => {
  // Cleanup
});

