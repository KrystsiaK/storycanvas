import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkDatabaseHealth, prisma } from '../database';

describe('Database Utilities', () => {
  describe('checkDatabaseHealth', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should return true when database is connected', async () => {
      // Mock successful query
      vi.spyOn(prisma, '$queryRaw').mockResolvedValueOnce([{ '?column?': 1 }]);

      const result = await checkDatabaseHealth();
      expect(result).toBe(true);
    });

    it('should return false when database connection fails', async () => {
      // Mock failed query
      vi.spyOn(prisma, '$queryRaw').mockRejectedValueOnce(new Error('Connection failed'));

      const result = await checkDatabaseHealth();
      expect(result).toBe(false);
    });
  });
});


