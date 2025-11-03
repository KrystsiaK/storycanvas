import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { logger } from '../utils/logger';

/**
 * Validation target types
 */
type ValidationTarget = 'body' | 'params' | 'query';

/**
 * Middleware factory for request validation using Zod schemas
 * 
 * @param schema - Zod schema to validate against
 * @param target - Part of request to validate (body, params, query)
 * @returns Express middleware function
 * 
 * @example
 * router.post('/stories', validate(GenerateStorySchema, 'body'), controller.generateStory);
 */
export const validate = (
  schema: ZodSchema,
  target: ValidationTarget = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const dataToValidate = req[target];
      const validated = schema.parse(dataToValidate);
      
      // Replace request data with validated and sanitized data
      req[target] = validated;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        logger.warn('Validation failed', { errors, target });
        
        res.status(400).json({
          error: 'Validation failed',
          details: errors,
        });
        return;
      }
      
      logger.error('Unexpected validation error', { error });
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  };
};

