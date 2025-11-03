import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env, validateEnv } from './utils/env';
import { logger } from './utils/logger';
import { checkDatabaseHealth, disconnectDatabase } from './utils/database';

// Validate environment variables at startup
try {
  validateEnv();
  logger.info('Environment variables validated successfully');
} catch (error) {
  logger.error('Environment validation failed', { error });
  process.exit(1);
}

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration - properly secured
app.use(cors({
  origin: env.NODE_ENV === 'production' 
    ? env.ALLOWED_ORIGINS 
    : true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint with database check
app.get('/health', async (req: Request, res: Response) => {
  const dbHealthy = await checkDatabaseHealth();
  
  const healthStatus = {
    status: dbHealthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    service: 'storycanvas-backend',
    version: env.API_VERSION,
    database: dbHealthy ? 'connected' : 'disconnected',
    environment: env.NODE_ENV,
  };

  const statusCode = dbHealthy ? 200 : 503;
  
  logger.info('Health check performed', { health: healthStatus });
  
  res.status(statusCode).json(healthStatus);
});

// Import routes
import { authRoutes } from './routes/auth.routes';
import { storyRoutes } from './routes/story.routes';
import { characterRoutes } from './routes/character.routes';

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/stories', storyRoutes);
app.use('/api/v1/characters', characterRoutes);

app.get('/api/v1', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to StoryCanvas API',
    version: env.API_VERSION,
    documentation: '/api/v1/docs',
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
  logger.warn('Route not found', { method: req.method, path: req.path });
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  logger.error('Unhandled error', { 
    error: err, 
    stack: err.stack,
    method: req.method,
    path: req.path 
  });
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  logger.info('Received shutdown signal, starting graceful shutdown...', { signal });
  
  try {
    await disconnectDatabase();
    logger.info('Database connections closed');
    
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown', { error });
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
app.listen(env.PORT, async () => {
  logger.info('🚀 StoryCanvas Backend started successfully', {
    port: env.PORT,
    environment: env.NODE_ENV,
    version: env.API_VERSION,
  });
  
  logger.info(`🔗 Health check: http://localhost:${env.PORT}/health`);
  logger.info(`📚 API docs: http://localhost:${env.PORT}/api/v1`);
  
  // Check database connection on startup
  const dbHealthy = await checkDatabaseHealth();
  if (dbHealthy) {
    logger.info('✅ Database connection verified');
  } else {
    logger.error('❌ Database connection failed - check your DATABASE_URL');
  }
});

export default app;

