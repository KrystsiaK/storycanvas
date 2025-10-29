import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthController } from '../../../controllers/auth.controller';
import { prisma } from '../../../lib/prisma';

jest.mock('../../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
  let authController: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    authController = new AuthController();
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    
    mockRequest = {
      body: {},
    };
    
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };

    jest.clearAllMocks();
  });

  describe('register', () => {
    const validRegisterData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should register a new user successfully', async () => {
      mockRequest.body = validRegisterData;

      const hashedPassword = 'hashed_password';
      const mockUser = {
        id: '1',
        name: validRegisterData.name,
        email: validRegisterData.email,
        avatar: null,
        createdAt: new Date(),
      };
      const mockToken = 'mock_jwt_token';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: validRegisterData.email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(validRegisterData.password, 10);
      expect(prisma.user.create).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        user: mockUser,
        token: mockToken,
      });
    });

    it('should return 400 if required fields are missing', async () => {
      mockRequest.body = { email: 'test@example.com' };

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'All fields are required' });
    });

    it('should return 400 if password is too short', async () => {
      mockRequest.body = {
        ...validRegisterData,
        password: 'short',
      };

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Password must be at least 8 characters' });
    });

    it('should return 400 if email already exists', async () => {
      mockRequest.body = validRegisterData;

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', email: validRegisterData.email });

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Email already registered' });
    });

    it('should return 500 on database error', async () => {
      mockRequest.body = validRegisterData;

      (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Registration failed' });
    });
  });

  describe('login', () => {
    const validLoginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: '1',
      name: 'Test User',
      email: validLoginData.email,
      password: 'hashed_password',
      avatar: null,
    };

    it('should login user successfully', async () => {
      mockRequest.body = validLoginData;
      const mockToken = 'mock_jwt_token';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: validLoginData.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(validLoginData.password, mockUser.password);
      expect(jsonMock).toHaveBeenCalledWith({
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          avatar: mockUser.avatar,
        },
        token: mockToken,
      });
    });

    it('should return 400 if email or password is missing', async () => {
      mockRequest.body = { email: 'test@example.com' };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Email and password are required' });
    });

    it('should return 401 if user not found', async () => {
      mockRequest.body = validLoginData;

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return 401 if password is incorrect', async () => {
      mockRequest.body = validLoginData;

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return 500 on error', async () => {
      mockRequest.body = validLoginData;

      (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Login failed' });
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const oldToken = 'old_jwt_token';
      const newToken = 'new_jwt_token';
      const decoded = { userId: '1' };

      mockRequest.body = { token: oldToken };

      (jwt.verify as jest.Mock).mockReturnValue(decoded);
      (jwt.sign as jest.Mock).mockReturnValue(newToken);

      await authController.refreshToken(mockRequest as Request, mockResponse as Response);

      expect(jwt.verify).toHaveBeenCalledWith(oldToken, process.env.JWT_SECRET);
      expect(jwt.sign).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith({ token: newToken });
    });

    it('should return 400 if token is missing', async () => {
      mockRequest.body = {};

      await authController.refreshToken(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Token is required' });
    });

    it('should return 401 if token is invalid', async () => {
      mockRequest.body = { token: 'invalid_token' };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authController.refreshToken(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid token' });
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      await authController.logout(mockRequest as Request, mockResponse as Response);

      expect(jsonMock).toHaveBeenCalledWith({ message: 'Logged out successfully' });
    });
  });
});

