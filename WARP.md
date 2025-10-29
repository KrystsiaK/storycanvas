# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

StoryCanvas is an AI-powered interactive storytelling studio for families that transforms children's creativity into magical, interactive adventures. This is a monorepo containing:

- **Mobile App** (`apps/mobile/`): React Native 0.73 app with Redux Toolkit state management
- **Backend API** (`apps/backend/`): Node.js/Express REST API with PostgreSQL, Redis, and RabbitMQ
- **Shared Packages** (`packages/shared/`): Shared utilities and types (planned)

## Essential Commands

### Root Level (Monorepo)

```bash
# Install all dependencies
npm install

# Run mobile app
npm run mobile              # Start Metro bundler
npm run mobile:ios          # Run iOS simulator
npm run mobile:android      # Run Android emulator

# Run backend
npm run backend             # Development mode with hot reload
npm run backend:prod        # Production mode

# Testing & Quality
npm run test                # Run tests in all workspaces
npm run lint                # Lint all workspaces

# Clean install
npm run clean               # Remove all node_modules
npm run install:all         # Fresh install
```

### Backend (`apps/backend/`)

```bash
cd apps/backend

# Development
npm run dev                 # Start with nodemon hot reload
npm run build               # Compile TypeScript to dist/
npm run start               # Run compiled code

# Database (Prisma)
npm run prisma:generate     # Generate Prisma client after schema changes
npm run prisma:migrate      # Create and apply database migrations
npm run prisma:studio       # Open Prisma Studio GUI

# Testing
npm test                    # Run Jest tests
npm run lint                # Run ESLint
```

### Mobile (`apps/mobile/`)

```bash
cd apps/mobile

# Development
npm run start               # Start Metro bundler
npm run ios                 # Launch iOS simulator
npm run android             # Launch Android emulator

# Testing
npm test                    # Run Jest tests
npm run lint                # Run ESLint
```

### Docker Infrastructure

```bash
# Start all services (PostgreSQL, Redis, RabbitMQ, Backend)
docker-compose up -d

# Start specific services
docker-compose up -d postgres redis rabbitmq

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down
```

## Architecture & Code Structure

### Backend Architecture

**Entry Point**: `apps/backend/src/index.ts`

```
apps/backend/src/
├── controllers/        # Request handlers (auth, story, character)
├── routes/            # Express route definitions
├── services/          # Business logic & external services (OpenAI)
├── middleware/        # Auth, validation, error handling
└── index.ts           # Express app setup, middleware config
```

**Key Patterns**:
- Express.js REST API with standard MVC pattern
- Controllers handle HTTP requests/responses
- Services contain business logic and AI integrations
- Prisma ORM for database access with PostgreSQL
- JWT authentication via `auth.middleware.ts`
- Redis for caching, RabbitMQ for job queues

**API Structure**: All endpoints prefixed with `/api/v1/`
- `/api/v1/auth` - Authentication (register, login)
- `/api/v1/stories` - Story CRUD operations
- `/api/v1/characters` - Character management
- `/health` - Health check endpoint

**Database Schema** (`apps/backend/prisma/schema.prisma`):
- `User`: email, name, password, avatar
- `Story`: title, content, genre, language, ageGroup, audioUrl, videoUrl, pdfUrl
- `Character`: name, description, imageUrl
- `StoryCharacter`: junction table linking stories to characters with roles

### Mobile Architecture

**Entry Point**: `apps/mobile/App.tsx`

```
apps/mobile/src/
├── navigation/         # React Navigation setup (Auth, Main, App navigators)
├── screens/           # Screen components
│   ├── auth/          # Welcome, Login, Register
│   └── main/          # Library, Create, Profile
├── store/             # Redux Toolkit slices & configuration
├── services/          # API client (RTK Query)
└── theme.ts           # React Native Paper theme
```

**Key Patterns**:
- Functional components with React hooks
- Redux Toolkit for global state management
- RTK Query for data fetching and caching
- React Navigation for routing
- React Native Paper for UI components
- TypeScript for type safety

**State Management**:
- `authSlice`: User authentication state
- `storySlice`: Story creation/management state  
- `api`: RTK Query API client for backend communication

### Technology Stack

**Mobile**: React Native 0.73, Redux Toolkit, RTK Query, React Navigation, React Native Paper

**Backend**: Node.js 20.x, Express.js, Prisma (PostgreSQL), Redis, RabbitMQ, OpenAI GPT-4o-mini/DALL-E 3, ElevenLabs

**DevOps**: Docker Compose (local), GitHub Actions CI/CD, AWS (EKS, S3, RDS), Cloudflare CDN

## Development Setup

### Prerequisites
- Node.js 20.x+
- npm 9.0.0+
- PostgreSQL 14+ (or use Docker)
- Redis (or use Docker)
- React Native development environment (iOS: Xcode, Android: Android Studio)

### Initial Setup

1. **Clone and install**:
   ```bash
   git clone https://github.com/KrystsiaK/storycanvas.git
   cd storycanvas
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp apps/backend/.env.example apps/backend/.env
   cp apps/mobile/.env.example apps/mobile/.env
   # Edit .env files with your API keys and configuration
   ```

3. **Start infrastructure** (PostgreSQL, Redis, RabbitMQ):
   ```bash
   docker-compose up -d postgres redis rabbitmq
   ```

4. **Setup database**:
   ```bash
   cd apps/backend
   npm run prisma:migrate
   npm run prisma:generate
   ```

5. **Run backend**:
   ```bash
   npm run backend
   # Or from root: npm run backend
   ```

6. **Run mobile app**:
   ```bash
   npm run mobile:ios
   # Or: npm run mobile:android
   ```

## Development Guidelines

### Branch Strategy
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring
- `test/*` - Test additions/modifications

### Commit Convention
Follow conventional commits:
```
type(scope): subject

feat(mobile): add character drawing interface
fix(backend): resolve story generation timeout
docs(readme): update installation instructions
```

### Code Style
- **TypeScript**: Required for all new code
- **React Native**: Functional components with hooks, TypeScript prop types
- **Backend**: RESTful conventions, async/await, proper error handling, input validation
- **Testing**: Write tests for new features, ensure existing tests pass

### Database Changes
After modifying `apps/backend/prisma/schema.prisma`:
1. Generate Prisma client: `npm run prisma:generate`
2. Create migration: `npm run prisma:migrate`
3. The Prisma client will be auto-generated in `node_modules/@prisma/client`

### AI Service Integration
The backend integrates with:
- **OpenAI GPT-4o-mini**: Story generation (via `services/openai.service.ts`)
- **DALL-E 3**: Character image generation
- **ElevenLabs**: Voice narration

Ensure API keys are configured in `apps/backend/.env` before using these features.

## Testing

Run tests before committing:
```bash
npm test                           # All workspaces
npm test --workspace=apps/backend  # Backend only
npm test --workspace=apps/mobile   # Mobile only
```

CI/CD automatically runs tests on push/PR via GitHub Actions (`.github/workflows/ci.yml`).

## Project Status

Currently in **Phase 1 (MVP)** development:
- ✅ Market research and technology stack completed
- ✅ Project structure and initial setup
- 🚧 Core story generation engine (in progress)
- 🚧 Basic mobile app UI (in progress)
- ⏳ User authentication and profiles
- ⏳ PDF export functionality

See `README.md` for full roadmap.
