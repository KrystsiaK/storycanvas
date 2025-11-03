import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/database';
import { logger } from '../utils/logger';
import { env } from '../utils/env';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        logger.warn('Registration attempt with existing email', { email });
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password with 12 rounds (more secure than default 10)
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          createdAt: true,
        },
      });

      // Generate JWT token using validated env vars
      const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: '7d' });

      logger.info('User registered successfully', { userId: user.id, email: user.email });

      res.status(201).json({
        user,
        token,
      });
    } catch (error) {
      logger.error('Registration failed', { error, email: req.body?.email });
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        logger.warn('Login attempt with non-existent email', { email });
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        logger.warn('Login attempt with invalid password', { userId: user.id, email });
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token using validated env vars
      const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: '7d' });

      logger.info('User logged in successfully', { userId: user.id, email: user.email });

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
        token,
      });
    } catch (error) {
      logger.error('Login failed', { error, email: req.body?.email });
      res.status(500).json({ error: 'Login failed' });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { token } = req.body;

      const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };

      // Verify user still exists
      const user = await prisma.user.findUnique({ 
        where: { id: decoded.userId },
        select: { id: true }
      });

      if (!user) {
        logger.warn('Token refresh attempted for non-existent user', { userId: decoded.userId });
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Generate new token
      const newToken = jwt.sign({ userId: decoded.userId }, env.JWT_SECRET, { expiresIn: '7d' });

      logger.info('Token refreshed successfully', { userId: decoded.userId });

      res.json({ token: newToken });
    } catch (error) {
      logger.warn('Token refresh failed', { error });
      res.status(401).json({ error: 'Invalid token' });
    }
  }

  async logout(req: Request, res: Response) {
    // In a stateless JWT setup, logout is handled client-side
    // Here we could add token to a blacklist if needed
    logger.info('User logged out');
    res.json({ message: 'Logged out successfully' });
  }
}
