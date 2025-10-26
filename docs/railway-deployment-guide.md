# StoryCanvas Railway Deployment Guide

## Quick Start Guide - Deploy in 10 Minutes! 🚀

### Current Status
✅ Project created: **mindful-patience**  
✅ Services detected: `@storycanvas/mobile` and `@storycanvas/backend`  
⏳ Need to add: PostgreSQL, Redis, Environment Variables

---

## Step 1: Add PostgreSQL Database

1. **Open Command Palette**
   - Press `Ctrl+K` (or `Cmd+K` on Mac)
   - Type "database" or scroll to find **"Database"**
   - Click on it

2. **Select PostgreSQL**
   - In the new menu, select **"Add PostgreSQL"**
   - Railway will automatically provision a PostgreSQL database
   - Wait for it to deploy (usually 30-60 seconds)

3. **Verify Database**
   - You should see a new service card labeled **"Postgres"** on your canvas
   - It will have a green checkmark when ready

---

## Step 2: Add Redis (Optional but Recommended)

1. **Open Command Palette Again**
   - Press `Ctrl+K`
   - Type "database"
   - Click **"Database"**

2. **Select Redis**
   - Choose **"Add Redis"**
   - Wait for deployment

3. **Verify Redis**
   - New **"Redis"** service card should appear

---

## Step 3: Configure Backend Environment Variables

1. **Click on the Backend Service**
   - Click on the `@storycanvas/backend` card

2. **Go to Variables Tab**
   - In the service panel, click on **"Variables"** tab

3. **Add Required Variables**
   Click **"+ New Variable"** and add each of these:

   ```
   NODE_ENV=production
   PORT=3000
   ```

4. **Add Database URL**
   - Click **"+ New Variable"**
   - Name: `DATABASE_URL`
   - Click **"Add Reference"**
   - Select: **Postgres → DATABASE_URL**
   - This automatically links your PostgreSQL database!

5. **Add Redis URL** (if you added Redis)
   - Click **"+ New Variable"**
   - Name: `REDIS_URL`
   - Click **"Add Reference"**
   - Select: **Redis → REDIS_URL**

6. **Add JWT Secret**
   ```
   JWT_SECRET=your-super-secret-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   ```

7. **Add OpenAI API Key** (REQUIRED for story generation)
   ```
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```
   
   ⚠️ **Important**: You need a real OpenAI API key from https://platform.openai.com/api-keys

8. **Add CORS Settings**
   ```
   ALLOWED_ORIGINS=*
   ```

---

## Step 4: Configure Backend Service Settings

1. **Still in Backend Service, go to Settings Tab**

2. **Set Root Directory**
   - Find **"Root Directory"** setting
   - Set to: `apps/backend`

3. **Set Build Command** (if not auto-detected)
   - Find **"Build Command"**
   - Set to: `npm ci && npm run build --workspace=apps/backend`

4. **Set Start Command** (if not auto-detected)
   - Find **"Start Command"**
   - Set to: `npm run start --workspace=apps/backend`

5. **Enable Health Check**
   - Find **"Health Check Path"**
   - Set to: `/health`

---

## Step 5: Deploy Backend

1. **Go Back to Canvas**
   - Click on the project name or canvas icon

2. **Click Deploy Button**
   - You should see a purple **"Deploy"** button
   - Click it!

3. **Watch Deployment**
   - Click on **"Observability"** tab to see logs
   - Wait for build to complete (3-5 minutes first time)
   - Look for: "Server is running on port 3000"

4. **Check Deployment Status**
   - Backend service card should turn green when deployed
   - Click on it to see the **public URL** (e.g., `https://storycanvas-backend-production.up.railway.app`)

---

## Step 6: Run Database Migrations

⚠️ **Important**: Before the backend works, you need to run Prisma migrations!

### Option A: Using Railway CLI (Recommended)

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Link to Your Project**
   ```bash
   cd /path/to/storycanvas
   railway link
   ```
   - Select your project: **mindful-patience**
   - Select environment: **production**

4. **Run Migrations**
   ```bash
   railway run --service backend npx prisma migrate deploy
   ```

### Option B: Using Railway Dashboard

1. **Go to Backend Service**
2. **Click on "Settings" → "Deploy"**
3. **Add a one-time deploy command:**
   ```bash
   npx prisma migrate deploy
   ```
4. **Trigger a new deployment**

---

## Step 7: Test Your Backend

1. **Get Your Backend URL**
   - Click on backend service
   - Copy the public URL (looks like: `https://xxx.up.railway.app`)

2. **Test Health Endpoint**
   Open in browser or use curl:
   ```bash
   curl https://your-backend-url.up.railway.app/health
   ```
   
   Expected response:
   ```json
   {
     "status": "ok",
     "timestamp": "2025-10-26T...",
     "service": "storycanvas-backend",
     "version": "v1"
   }
   ```

3. **Test API Endpoint**
   ```bash
   curl https://your-backend-url.up.railway.app/api/v1
   ```

---

## Step 8: Update Mobile App Configuration

1. **Copy Your Backend URL**

2. **Update Mobile App Environment**
   - Go to `@storycanvas/mobile` service
   - Add variable:
   ```
   API_BASE_URL=https://your-backend-url.up.railway.app/api/v1
   ```

---

## Step 9: Configure Custom Domain (Optional)

1. **Go to Backend Service → Settings**
2. **Find "Domains" section**
3. **Click "Generate Domain"** for a Railway subdomain
4. **Or add your custom domain:**
   - Click "Custom Domain"
   - Enter: `api.storycanvas.app`
   - Add CNAME record to your DNS:
     ```
     CNAME api.storycanvas.app → your-railway-domain.railway.app
     ```

---

## Troubleshooting

### Backend Won't Start

**Check Logs:**
1. Go to backend service
2. Click "Observability" → "Logs"
3. Look for error messages

**Common Issues:**

1. **"Cannot find module '@prisma/client'"**
   - Solution: Make sure build command includes Prisma generation
   - Add to build command: `npx prisma generate &&`

2. **"Connection refused" or database errors**
   - Solution: Check DATABASE_URL is properly referenced
   - Make sure PostgreSQL service is running

3. **"OPENAI_API_KEY is not defined"**
   - Solution: Add your OpenAI API key to environment variables

### Database Connection Issues

1. **Check PostgreSQL is Running**
   - Green checkmark on Postgres service card

2. **Verify DATABASE_URL Reference**
   - Backend variables should show: `DATABASE_URL → ${{Postgres.DATABASE_URL}}`

3. **Run Migrations**
   - Use Railway CLI: `railway run --service backend npx prisma migrate deploy`

### Build Fails

1. **Check Node Version**
   - Add to backend variables: `NODE_VERSION=20`

2. **Clear Build Cache**
   - Go to Settings → "Clear Build Cache"
   - Trigger new deployment

---

## Cost Estimate

Railway pricing (as of 2025):

- **Hobby Plan**: $5/month
  - $5 credit included
  - Pay only for usage above credit
  
- **Estimated Monthly Cost**:
  - Backend service: ~$3-5
  - PostgreSQL: ~$2-3
  - Redis: ~$1-2
  - **Total: ~$6-10/month**

---

## Next Steps

Once deployed:

1. ✅ Test all API endpoints
2. ✅ Create a test user account
3. ✅ Generate a test story
4. ✅ Monitor logs for errors
5. ✅ Set up monitoring (Sentry)
6. ✅ Configure backups for database
7. ✅ Add custom domain
8. ✅ Deploy mobile app to stores

---

## Useful Railway Commands

```bash
# View logs
railway logs --service backend

# Run command in production
railway run --service backend <command>

# Open service in browser
railway open

# Check service status
railway status

# Restart service
railway restart --service backend
```

---

## Support

If you encounter issues:

1. Check Railway logs first
2. Review environment variables
3. Verify database connection
4. Check GitHub repository for latest code

**Railway Documentation**: https://docs.railway.app  
**StoryCanvas Repository**: https://github.com/KrystsiaK/storycanvas

---

**Last Updated**: October 26, 2025  
**Project**: mindful-patience  
**Environment**: production

