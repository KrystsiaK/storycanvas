# StoryCanvas Backend

AI-powered storytelling API built with Node.js, Express, TypeScript, and Prisma.

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL 14+
- Redis (optional, for caching)
- RabbitMQ (optional, for job queues)

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Copy environment variables
cp .env.example .env
# Edit .env and add your configuration
```

### Environment Variables

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT tokens (minimum 32 characters)

Optional variables:
- `PORT` - Server port (default: 3000)
- `OPENAI_API_KEY` - OpenAI API key for story generation
- `REDIS_URL` - Redis connection string
- `RABBITMQ_URL` - RabbitMQ connection string
- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins

See `.env.example` for complete list.

## 🧪 Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── controllers/       # Request handlers
├── middleware/        # Express middleware
├── routes/           # API route definitions
├── services/         # Business logic
├── validators/       # Zod validation schemas
├── utils/            # Utility functions
│   ├── database.ts   # Prisma singleton
│   ├── logger.ts     # Winston logger
│   └── env.ts        # Environment validation
└── index.ts          # Application entry point
```

## 🔒 Security Features

- ✅ JWT authentication with secure token validation
- ✅ Zod input validation on all endpoints
- ✅ CORS properly configured
- ✅ Helmet.js security headers
- ✅ Environment variable validation at startup
- ✅ Bcrypt password hashing (12 rounds)
- ✅ Request body size limits

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh JWT token
- `POST /api/v1/auth/logout` - Logout user

### Stories (Protected)
- `POST /api/v1/stories/generate` - Generate new story
- `GET /api/v1/stories` - Get user's stories
- `GET /api/v1/stories/:id` - Get story details
- `PATCH /api/v1/stories/:id` - Update story
- `DELETE /api/v1/stories/:id` - Delete story

### Characters (Protected)
- `POST /api/v1/characters/generate` - Create character
- `GET /api/v1/characters` - Get user's characters
- `GET /api/v1/characters/:id` - Get character details
- `DELETE /api/v1/characters/:id` - Delete character

### Health
- `GET /health` - Health check endpoint

## 🧪 Testing

The project uses Vitest for fast, modern testing:

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Interactive UI
npm run test:ui

# Coverage report
npm run test:coverage
```

### Test Coverage

- ✅ Environment validation
- ✅ Request validation (Zod schemas)
- ✅ Logger utilities
- ✅ Database health checks
- ✅ All validators (auth, story, character)

Target: 80%+ code coverage

## 🏗️ Architecture

### Design Patterns

- **Singleton Pattern**: Prisma client for database connections
- **Middleware Pattern**: Express middleware for validation and auth
- **Repository Pattern**: Future implementation planned
- **Factory Pattern**: Validation middleware factory

### Key Libraries

- **Express.js** - Web framework
- **Prisma** - Type-safe ORM
- **Zod** - Schema validation
- **Winston** - Structured logging
- **Vitest** - Fast unit testing
- **OpenAI** - AI story generation

## 🔄 Modernization (Completed)

✅ **Security Fixes**
- Replaced hardcoded JWT secrets with env validation
- Fixed CORS configuration
- Added input validation with Zod
- Increased bcrypt rounds to 12

✅ **Code Quality**
- Replaced console.log with Winston logger
- Created Prisma singleton (fixed memory leaks)
- Added comprehensive error handling
- Implemented graceful shutdown

✅ **Testing**
- Added Vitest configuration
- Created 31 unit tests (all passing)
- Test coverage for critical paths

✅ **Developer Experience**
- Environment variable validation at startup
- Better error messages
- Structured logging
- Health check with database status

## 📈 Future Improvements

- [ ] Implement BullMQ for async story generation
- [ ] Add Redis caching layer
- [ ] Implement rate limiting
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Increase test coverage to 80%+
- [ ] Add integration tests
- [ ] Implement event-driven architecture
- [ ] Add OpenTelemetry observability

## 📄 License

MIT

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.


