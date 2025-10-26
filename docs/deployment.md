# StoryCanvas Deployment Guide

This guide covers deploying StoryCanvas to production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Mobile App Deployment](#mobile-app-deployment)
4. [Database Setup](#database-setup)
5. [Environment Variables](#environment-variables)
6. [Monitoring and Logging](#monitoring-and-logging)

## Prerequisites

### Required Services

- **PostgreSQL 14+** - Primary database
- **Redis 7+** - Caching and session storage
- **RabbitMQ 3+** - Message queue for async tasks
- **AWS S3** - Media storage (images, audio, video, PDFs)
- **OpenAI API** - Story and image generation
- **ElevenLabs API** - Voice generation (optional)
- **Stripe** - Payment processing

### Required Accounts

- AWS account with S3, RDS, and EKS access
- OpenAI account with API access
- Stripe account for payments
- Cloudflare account for CDN
- Sentry account for error tracking
- Mixpanel account for analytics

## Backend Deployment

### Option 1: AWS EKS (Recommended for Production)

#### 1. Build Docker Image

```bash
cd apps/backend
docker build -t storycanvas-backend:latest .
docker tag storycanvas-backend:latest YOUR_ECR_REPO/storycanvas-backend:latest
docker push YOUR_ECR_REPO/storycanvas-backend:latest
```

#### 2. Create Kubernetes Deployment

```yaml
# k8s/backend-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: storycanvas-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: storycanvas-backend
  template:
    metadata:
      labels:
        app: storycanvas-backend
    spec:
      containers:
      - name: backend
        image: YOUR_ECR_REPO/storycanvas-backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: storycanvas-secrets
              key: database-url
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: storycanvas-secrets
              key: openai-api-key
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### 3. Apply Kubernetes Configuration

```bash
kubectl apply -f k8s/backend-deployment.yml
kubectl apply -f k8s/backend-service.yml
kubectl apply -f k8s/backend-ingress.yml
```

### Option 2: Heroku (Quick Start)

```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Login
heroku login

# Create app
heroku create storycanvas-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Add Redis
heroku addons:create heroku-redis:premium-0

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set OPENAI_API_KEY=your-key
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

### Option 3: Railway (Modern Alternative)

1. Connect GitHub repository to Railway
2. Select `apps/backend` as root directory
3. Add PostgreSQL and Redis services
4. Set environment variables in dashboard
5. Deploy automatically on git push

### Option 4: Render (Simple Deployment)

1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `npm run build --workspace=apps/backend`
4. Set start command: `npm run start --workspace=apps/backend`
5. Add PostgreSQL and Redis services
6. Configure environment variables

## Mobile App Deployment

### iOS Deployment

#### 1. Prerequisites

- Apple Developer Account ($99/year)
- Xcode installed on macOS
- iOS Distribution Certificate
- App Store Connect access

#### 2. Build for Production

```bash
cd apps/mobile

# Install dependencies
npm install

# Build iOS app
npx react-native run-ios --configuration Release
```

#### 3. Submit to App Store

```bash
# Using Fastlane
fastlane ios release

# Or manually through Xcode
# 1. Open ios/StoryCanvas.xcworkspace in Xcode
# 2. Select Product > Archive
# 3. Upload to App Store Connect
# 4. Submit for review
```

### Android Deployment

#### 1. Prerequisites

- Google Play Console account ($25 one-time)
- Android signing key

#### 2. Generate Signing Key

```bash
cd apps/mobile/android/app
keytool -genkeypair -v -storetype PKCS12 -keystore storycanvas-release.keystore -alias storycanvas -keyalg RSA -keysize 2048 -validity 10000
```

#### 3. Build Release APK/AAB

```bash
cd apps/mobile/android
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

#### 4. Upload to Google Play

1. Go to Google Play Console
2. Create new application
3. Upload AAB file
4. Fill in store listing details
5. Submit for review

### Using Expo (Alternative Approach)

If you want simpler deployment, consider migrating to Expo:

```bash
# Install Expo
npm install -g expo-cli

# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Or use EAS Build (recommended)
eas build --platform all
```

## Database Setup

### PostgreSQL Migration

```bash
# Run migrations
cd apps/backend
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

### Backup Strategy

```bash
# Automated daily backups
pg_dump -h your-db-host -U your-user -d storycanvas > backup-$(date +%Y%m%d).sql

# Restore from backup
psql -h your-db-host -U your-user -d storycanvas < backup-20250101.sql
```

## Environment Variables

### Backend Production Environment

```bash
# Server
NODE_ENV=production
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:pass@host:5432/storycanvas

# Redis
REDIS_URL=redis://host:6379

# RabbitMQ
RABBITMQ_URL=amqp://host:5672

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=sk-your-key

# DALL-E
DALLE_API_KEY=sk-your-key

# ElevenLabs
ELEVENLABS_API_KEY=your-key

# Stripe
STRIPE_SECRET_KEY=sk_live_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-secret

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
S3_BUCKET_NAME=storycanvas-production

# Cloudflare
CLOUDFLARE_ACCOUNT_ID=your-id
CLOUDFLARE_API_TOKEN=your-token

# Monitoring
SENTRY_DSN=your-sentry-dsn
MIXPANEL_TOKEN=your-mixpanel-token

# CORS
ALLOWED_ORIGINS=https://storycanvas.app,https://www.storycanvas.app
```

### Mobile App Production Environment

```bash
# API
API_BASE_URL=https://api.storycanvas.app/api/v1
API_TIMEOUT=30000

# Environment
ENVIRONMENT=production

# Analytics
MIXPANEL_TOKEN=your-token

# Sentry
SENTRY_DSN=your-dsn

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_your-key
```

## Monitoring and Logging

### Sentry Setup

```typescript
// Backend
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Mobile
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.ENVIRONMENT,
});
```

### Logging

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

### Health Checks

```bash
# Backend health check
curl https://api.storycanvas.app/health

# Expected response
{
  "status": "ok",
  "timestamp": "2025-10-26T14:00:00.000Z",
  "service": "storycanvas-backend",
  "version": "v1"
}
```

## Cost Estimates

### Monthly Costs (Estimated)

| Service | Plan | Cost |
|---------|------|------|
| AWS EKS | 3 nodes (t3.medium) | $90 |
| AWS RDS (PostgreSQL) | db.t3.medium | $70 |
| AWS S3 | 100GB storage + transfer | $10 |
| Redis Cloud | 1GB | $15 |
| OpenAI API | ~10K stories/month | $100 |
| Cloudflare | Pro plan | $20 |
| Sentry | Team plan | $26 |
| **Total** | | **~$331/month** |

### Scaling Considerations

- Start with smaller instances and scale up based on usage
- Use auto-scaling for backend pods
- Implement caching aggressively to reduce API costs
- Consider reserved instances for predictable workloads

## Troubleshooting

### Common Issues

**Database Connection Errors**
```bash
# Check connection
psql $DATABASE_URL

# Verify Prisma client
npx prisma generate
```

**OpenAI API Errors**
```bash
# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**Mobile App Build Failures**
```bash
# Clean build
cd apps/mobile
rm -rf node_modules
npm install
cd ios && pod install
```

## Support

For deployment issues:
- Check logs: `kubectl logs -f deployment/storycanvas-backend`
- Review documentation: https://docs.storycanvas.app
- Contact support: support@storycanvas.app

---

**Last Updated:** October 26, 2025

