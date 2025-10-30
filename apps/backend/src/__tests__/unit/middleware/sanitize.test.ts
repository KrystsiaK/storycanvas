import { Request, Response, NextFunction } from 'express';
import { sanitizeInput, preventNoSQLInjection } from '../../../middleware/sanitize.middleware';

describe('Sanitize Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    
    mockRequest = {
      body: {},
      query: {},
      params: {},
    };
    
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
    
    mockNext = jest.fn();
  });

  describe('sanitizeInput', () => {
    it('should sanitize HTML tags in body', () => {
      mockRequest.body = {
        name: '<script>alert("xss")</script>John',
        description: '<img src=x onerror=alert(1)>',
      };

      sanitizeInput(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.body.name).not.toContain('<script>');
      expect(mockRequest.body.name).not.toContain('</script>');
      expect(mockRequest.body.description).not.toContain('<img');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should sanitize nested objects', () => {
      mockRequest.body = {
        user: {
          name: '<b>Bold Name</b>',
          details: {
            bio: '<i>Italic bio</i>',
          },
        },
      };

      sanitizeInput(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.body.user.name).not.toContain('<b>');
      expect(mockRequest.body.user.details.bio).not.toContain('<i>');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should sanitize arrays', () => {
      mockRequest.body = {
        tags: ['<script>alert(1)</script>', 'normal tag', '<b>bold</b>'],
      };

      sanitizeInput(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.body.tags[0]).not.toContain('<script>');
      expect(mockRequest.body.tags[2]).not.toContain('<b>');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle query parameters', () => {
      mockRequest.query = {
        search: '<script>alert("xss")</script>',
      };

      sanitizeInput(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.query.search).not.toContain('<script>');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle URL parameters', () => {
      mockRequest.params = {
        id: '<script>alert(1)</script>',
      };

      sanitizeInput(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.params.id).not.toContain('<script>');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should not affect non-string values', () => {
      mockRequest.body = {
        age: 25,
        active: true,
        metadata: null,
      };

      sanitizeInput(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.body.age).toBe(25);
      expect(mockRequest.body.active).toBe(true);
      expect(mockRequest.body.metadata).toBeNull();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('preventNoSQLInjection', () => {
    it('should block MongoDB operators in body', () => {
      (mockRequest.body as any) = {
        email: { $gt: '' },
      };

      preventNoSQLInjection(mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Invalid input',
        message: 'Request contains potentially malicious content',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should block $where operators', () => {
      mockRequest.body = {
        filter: '$where: "this.age > 18"',
      };

      preventNoSQLInjection(mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should block $regex operators', () => {
      (mockRequest.body as any) = {
        name: { $regex: '.*' },
      };

      preventNoSQLInjection(mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should allow normal strings with $ in content', () => {
      mockRequest.body = {
        price: '$100',
        description: 'Costs $50',
      };

      preventNoSQLInjection(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('should check query parameters', () => {
      (mockRequest.query as any) = {
        filter: { $ne: null },
      };

      preventNoSQLInjection(mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should check nested objects', () => {
      (mockRequest.body as any) = {
        user: {
          credentials: {
            password: { $gt: '' },
          },
        },
      };

      preventNoSQLInjection(mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should allow safe input', () => {
      mockRequest.body = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
      };

      preventNoSQLInjection(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });
  });
});

