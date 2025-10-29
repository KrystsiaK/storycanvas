import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      // Validate input
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

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

      // Generate JWT token
      const secret = process.env.JWT_SECRET!;
      const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
      const token = jwt.sign({ userId: user.id }, secret, { expiresIn } as jwt.SignOptions);

      res.status(201).json({
        user,
        token,
      });
    } catch (error) {
      logger.error('Register error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Find user
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const secret = process.env.JWT_SECRET!;
      const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
      const token = jwt.sign({ userId: user.id }, secret, { expiresIn } as jwt.SignOptions);

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
      logger.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      const secret = process.env.JWT_SECRET!;
      const decoded = jwt.verify(token, secret) as { userId: string };

      // Generate new token
      const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
      const newToken = jwt.sign({ userId: decoded.userId }, secret, { expiresIn } as jwt.SignOptions);

      res.json({ token: newToken });
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }

  async logout(req: Request, res: Response) {
    // In a stateless JWT setup, logout is handled client-side
    // Here we could add token to a blacklist if needed
    res.json({ message: 'Logged out successfully' });
  }
}

