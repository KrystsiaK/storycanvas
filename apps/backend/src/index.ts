import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/stories', storyRoutes);
app.use('/api/v1/characters', characterRoutes);

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
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 StoryCanvas Backend running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;

