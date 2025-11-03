import { describe, it, expect } from 'vitest';
import { logger } from '../logger';

describe('Logger', () => {
  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should have standard log methods', () => {
    expect(logger.info).toBeDefined();
    expect(logger.error).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.debug).toBeDefined();
  });

  it('should log info without throwing', () => {
    expect(() => {
      logger.info('Test info message');
    }).not.toThrow();
  });

  it('should log error without throwing', () => {
    expect(() => {
      logger.error({ error: new Error('Test error') }, 'Test error message');
    }).not.toThrow();
  });

  it('should log with metadata', () => {
    expect(() => {
      logger.info({ userId: '123', action: 'test' }, 'Test with metadata');
    }).not.toThrow();
  });
});


