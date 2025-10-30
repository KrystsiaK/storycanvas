import Redis from 'ioredis';
import { logger } from './logger';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const REDIS_ENABLED = process.env.REDIS_ENABLED === 'true'; // Disabled by default

// Create Redis client only if enabled
export const redis = REDIS_ENABLED ? new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError: (err) => {
    const targetErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT'];
    if (targetErrors.some(target => err.message.includes(target))) {
      return true;
    }
    return false;
  },
  lazyConnect: true, // Don't connect immediately
}) : null;

if (redis) {
  redis.on('connect', () => {
    logger.info('Redis client connected');
  });

  redis.on('error', (err) => {
    logger.warn('Redis client error (caching disabled):', err.message);
  });

  redis.on('reconnecting', () => {
    logger.info('Redis client reconnecting');
  });
}

// Cache utility functions
export class CacheService {
  private ttl = {
    short: 60, // 1 minute
    medium: 300, // 5 minutes
    long: 3600, // 1 hour
    day: 86400, // 24 hours
  };

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!redis) return null;
    try {
      const data = await redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      logger.debug(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    if (!redis) return false;
    try {
      const ttl = ttlSeconds || this.ttl.medium;
      const serialized = JSON.stringify(value);
      await redis.setex(key, ttl, serialized);
      return true;
    } catch (error) {
      logger.debug(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete value from cache
   */
  async del(key: string): Promise<boolean> {
    if (!redis) return false;
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      logger.debug(`Cache del error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete multiple keys by pattern
   */
  async delPattern(pattern: string): Promise<number> {
    if (!redis) return 0;
    try {
      const keys = await redis.keys(pattern);
      if (keys.length === 0) return 0;
      
      const deleted = await redis.del(...keys);
      return deleted;
    } catch (error) {
      logger.debug(`Cache delPattern error for pattern ${pattern}:`, error);
      return 0;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    if (!redis) return false;
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.debug(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Set value with expiration time
   */
  async setWithExpiry(key: string, value: any, expiryInSeconds: number): Promise<boolean> {
    if (!redis) return false;
    try {
      const serialized = JSON.stringify(value);
      await redis.setex(key, expiryInSeconds, serialized);
      return true;
    } catch (error) {
      logger.debug(`Cache setWithExpiry error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get TTL values
   */
  getTTL() {
    return this.ttl;
  }
}

export const cacheService = new CacheService();

// Graceful shutdown
process.on('SIGTERM', async () => {
  if (redis) {
    logger.info('SIGTERM received, closing Redis connection...');
    await redis.quit();
  }
});

process.on('SIGINT', async () => {
  if (redis) {
    logger.info('SIGINT received, closing Redis connection...');
    await redis.quit();
  }
});

