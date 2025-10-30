# 🎨 StoryCanvas

AI-powered storytelling app for children. Create magical, personalized stories with custom characters, illustrations, and multiple languages.

[![CI/CD](https://github.com/yourusername/storycanvas/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/storycanvas/actions)

## 📱 Features

- **AI Story Generation**: GPT-4o-mini powered story creation
- **Custom Characters**: Draw and describe your own heroes
- **Multi-language**: Stories in 8+ languages
- **Age-appropriate**: Content tailored for different age groups (3-15 years)
- **PDF Export**: Beautiful story PDFs for sharing
- **Profile Management**: User accounts with story library
- **Offline Support**: Redux persist for mobile app

## 🏗️ Architecture

**Monorepo Structure:**
- `apps/backend` - Express.js REST API
- `apps/mobile` - React Native (Expo) mobile app

**Tech Stack:**
- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Mobile**: React Native, Expo, Redux Toolkit, RTK Query
- **AI**: OpenAI GPT-4o-mini, DALL-E 3
- **Infrastructure**: Docker, Redis (optional caching)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (recommended)
- PostgreSQL 15+ (or use Docker)
- OpenAI API key

### Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/storycanvas.git
cd storycanvas
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
# Copy example env files
cp apps/backend/.env.example apps/backend/.env

# Edit .env with your credentials
# Required: DATABASE_URL, JWT_SECRET, OPENAI_API_KEY
```

4. **Start with Docker (recommended)**
```bash
# Start all services (PostgreSQL, Redis, Backend)
docker-compose up -d

# View logs
docker-compose logs -f backend
```

5. **Or start manually**
```bash
# Start PostgreSQL (if not using Docker)
# Then run migrations
cd apps/backend
npx prisma migrate deploy
npx prisma generate

# Start backend
npm run dev

# In another terminal, start mobile
cd apps/mobile
npm start
```

## 🧪 Testing

```bash
# Backend tests
cd apps/backend
npm test                 # Unit tests
npm run test:e2e         # E2E tests
npm run test:coverage    # Coverage report

# Mobile tests
cd apps/mobile
npm test
```

**Test Results:**
- Backend: 82/82 tests ✅
- Mobile: 9/9 tests ✅

## 🐳 Docker Deployment

### Production Build

```bash
# Build and start all services
docker-compose up -d

# Check health
docker-compose ps
curl http://localhost:3000/health
```

### Environment Variables

See `.env.example` for all available options. Key variables:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing key (min 32 chars)
- `OPENAI_API_KEY` - OpenAI API key
- `REDIS_ENABLED` - Enable Redis caching (default: false)
- `ALLOWED_ORIGINS` - CORS allowed origins

## 📊 Performance

- **Database Indexes**: Optimized queries for userId, createdAt, genre
- **Redis Caching**: Optional caching layer (3-10 min TTL)
- **Pagination**: Efficient loading of large story lists
- **Rate Limiting**: 
  - Auth endpoints: 5 req/15min
  - Story generation: 10 req/hour
  - Global API: 100 req/15min

## 🔒 Security

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Joi schemas for all endpoints
- **XSS Protection**: Input sanitization
- **NoSQL Injection Prevention**: MongoDB operator filtering
- **Security Headers**: Helmet.js (CSP, HSTS, etc.)
- **Rate Limiting**: Express-rate-limit
- **CORS**: Configurable allowed origins

See [SECURITY.md](apps/backend/SECURITY.md) for details.

## 📁 Project Structure

```
storycanvas/
├── apps/
│   ├── backend/
│   │   ├── prisma/              # Database schema & migrations
│   │   ├── src/
│   │   │   ├── controllers/     # Request handlers
│   │   │   ├── routes/          # API routes
│   │   │   ├── services/        # Business logic (OpenAI)
│   │   │   ├── middleware/      # Auth, validation, security
│   │   │   ├── validators/      # Joi schemas
│   │   │   ├── lib/             # Redis, Prisma, Logger
│   │   │   └── __tests__/       # Unit & E2E tests
│   │   ├── Dockerfile
│   │   └── package.json
│   └── mobile/
│       ├── src/
│       │   ├── components/      # DrawingCanvas, etc.
│       │   ├── screens/         # App screens
│       │   ├── navigation/      # React Navigation
│       │   ├── store/           # Redux store & slices
│       │   ├── services/        # RTK Query API
│       │   └── __tests__/       # Component tests
│       └── package.json
├── docker-compose.yml
├── .github/workflows/           # CI/CD pipelines
└── package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout user

### Stories
- `POST /api/v1/stories/generate` - Generate new story
- `GET /api/v1/stories?page=1&limit=10` - Get user stories (paginated)
- `GET /api/v1/stories/:id` - Get single story
- `PATCH /api/v1/stories/:id` - Update story
- `DELETE /api/v1/stories/:id` - Delete story

### Profile
- `GET /api/v1/profile` - Get user profile
- `PATCH /api/v1/profile` - Update profile
- `DELETE /api/v1/profile` - Delete account

### PDF Export
- `GET /api/v1/pdf/story/:id` - Download story PDF
- `GET /api/v1/pdf/collection` - Download all stories PDF

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- OpenAI for GPT-4 and DALL-E 3 APIs
- React Native & Expo community
- Prisma for excellent ORM
