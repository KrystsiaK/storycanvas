import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import hpp from 'hpp';
import { logger } from './lib/logger';
import { validateEnv } from './lib/validateEnv';
import { apiLimiter } from './middleware/rateLimiter.middleware';

// Load environment variables
dotenv.config();

// Validate required environment variables
validateEnv();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
// Helmet - Set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

// HTTP Parameter Pollution prevention
app.use(hpp());

// Global rate limiter
app.use('/api/', apiLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// XSS Protection and NoSQL Injection prevention
import { sanitizeInput, preventNoSQLInjection } from './middleware/sanitize.middleware';
app.use(sanitizeInput);
app.use(preventNoSQLInjection);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'storycanvas-backend',
    version: process.env.API_VERSION || 'v1'
  });
});

// Import routes
import { authRoutes } from './routes/auth.routes';
import { storyRoutes } from './routes/story.routes';
import { characterRoutes } from './routes/character.routes';
import { profileRoutes } from './routes/profile.routes';
import { pdfRoutes } from './routes/pdf.routes';

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/stories', storyRoutes);
app.use('/api/v1/characters', characterRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/pdf', pdfRoutes);

app.get('/api/v1', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to StoryCanvas API',
    version: 'v1',
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth',
      stories: '/api/v1/stories',
      characters: '/api/v1/characters'
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  logger.error(`${err.name}: ${err.message}\n${err.stack}`);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 StoryCanvas Backend running on port ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;

