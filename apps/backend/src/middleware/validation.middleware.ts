import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { logger } from '../lib/logger';

type ValidationSource = 'body' | 'query' | 'params';

export const validate = (schema: Joi.Schema, source: ValidationSource = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = req[source];

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown keys
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      logger.warn('Validation error:', { errors, path: req.path });

      return res.status(400).json({
        error: 'Validation Error',
        details: errors,
      });
    }

    // Replace the original data with validated and sanitized data
    req[source] = value;
    next();
  };
};

