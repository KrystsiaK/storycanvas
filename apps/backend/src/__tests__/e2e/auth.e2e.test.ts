import request from 'supertest';
import express from 'express';
import { authRoutes } from '../../routes/auth.routes';
import { prisma } from '../../lib/prisma';

// Mock prisma for e2e tests
jest.mock('../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('Auth E2E Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/auth', authRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const mockCreatedUser = {
        id: '1',
        name: newUser.name,
        email: newUser.email,
        avatar: null,
        createdAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(newUser.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 400 if email already exists', async () => {
      const existingUser = {
        name: 'Jane Doe',
        email: 'existing@example.com',
        password: 'password123',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        email: existingUser.email,
      });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(existingUser)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Email already registered');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body.error).toBe('All fields are required');
    });

    it('should return 400 if password is too short', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'short',
        })
        .expect(400);

      expect(response.body.error).toBe('Password must be at least 8 characters');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: '1',
        name: 'Test User',
        email: loginData.email,
        password: '$2b$10$mockhashedpassword',
        avatar: null,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      // Mock bcrypt.compare
      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(loginData.email);
    });

    it('should return 401 with invalid credentials', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should return 400 if credentials are missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body.error).toBe('Email and password are required');
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should refresh token successfully', async () => {
      const jwt = require('jsonwebtoken');
      const mockToken = jwt.sign({ userId: '1' }, process.env.JWT_SECRET!, { expiresIn: '7d' });

      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ token: mockToken })
        .expect(200);

      expect(response.body).toHaveProperty('token');
    });

    it('should return 400 if token is missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Token is required');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ token: 'invalid-token' })
        .expect(401);

      expect(response.body.error).toBe('Invalid token');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .expect(200);

      expect(response.body.message).toBe('Logged out successfully');
    });
  });
});

