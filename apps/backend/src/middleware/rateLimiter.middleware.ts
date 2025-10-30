import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';

// Skip rate limiting in test environment
const skipRateLimit = (req: Request, res: Response) => process.env.NODE_ENV === 'test';

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many attempts',
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: skipRateLimit,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`);
    res.status(429).json({
      error: 'Too many attempts',
      message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
    });
  },
});

// Rate limiter for story generation (resource-intensive)
export const storyGenerationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 story generations per hour
  message: {
    error: 'Rate limit exceeded',
    message: 'You have reached the maximum number of story generations for this hour. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skip: skipRateLimit,
  handler: (req, res) => {
    logger.warn(`Story generation rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'You have reached the maximum number of story generations for this hour. Please try again later.',
    });
  },
});

// Global API rate limiter (more permissive)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipRateLimit,
  handler: (req, res) => {
    logger.warn(`Global rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`);
    res.status(429).json({
      error: 'Too many requests',
      message: 'Too many requests from this IP, please try again after 15 minutes',
    });
  },
});

