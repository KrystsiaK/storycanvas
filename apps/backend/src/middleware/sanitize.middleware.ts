import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

/**
 * Sanitize request data to prevent XSS attacks
 * Recursively sanitizes strings in body, query, and params
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      // Escape HTML and remove script tags
      return validator.escape(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    
    if (obj !== null && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = sanitize(obj[key]);
        }
      }
      return sanitized;
    }
    
    return obj;
  };

  // Sanitize body
  if (req.body) {
    req.body = sanitize(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitize(req.query);
  }

  // Sanitize URL parameters
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};

/**
 * Middleware to prevent NoSQL injection
 * Checks for suspicious operators in request data
 */
export const preventNoSQLInjection = (req: Request, res: Response, next: NextFunction) => {
  const mongoOperators = ['$where', '$regex', '$ne', '$gt', '$gte', '$lt', '$lte', '$in', '$nin', '$or', '$and', '$not'];
  
  const checkForInjection = (obj: any, path = ''): boolean => {
    if (typeof obj === 'string') {
      // Check for MongoDB operators as string values (e.g., "$where: ...")
      if (mongoOperators.some(op => obj.includes(op))) {
        return true;
      }
    }
    
    if (Array.isArray(obj)) {
      return obj.some((item, index) => checkForInjection(item, `${path}[${index}]`));
    }
    
    if (obj !== null && typeof obj === 'object') {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          // Check if key itself is a MongoDB operator
          if (key.startsWith('$') && mongoOperators.includes(key)) {
            return true;
          }
          if (checkForInjection(obj[key], `${path}.${key}`)) {
            return true;
          }
        }
      }
    }
    
    return false;
  };

  const sources = [req.body, req.query, req.params];
  
  for (const source of sources) {
    if (source && checkForInjection(source)) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Request contains potentially malicious content',
      });
    }
  }

  next();
};

