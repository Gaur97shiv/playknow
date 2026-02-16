# PlayKnow - Render Deployment Guide

This guide explains how to deploy the PlayKnow application to Render.

## Overview

PlayKnow is deployed as a full-stack application on Render with:

- **Backend**: Node.js/Express API server
- **Frontend**: React/Vite static website
- **Database**: MongoDB (external or Atlas)
- **Storage**: Cloudinary (external)

## Prerequisites

Before deploying, ensure you have:

1. **GitHub Account** - Push your code to GitHub
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **Environment Variables Ready**:
   - MongoDB URI (from MongoDB Atlas or your provider)
   - JWT Secret (generate a random string)
   - Cloudinary credentials (API key, secret, cloud name)

## Setup Instructions

### Step 1: Prepare Environment Variables

Copy `.env.example` to understand the required variables:

```bash
# Backend Configuration
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend Configuration
VITE_API_URL=https://your-backend-url.onrender.com
```

### Step 2: Push Code to GitHub

Ensure your project is pushed to GitHub with all changes:

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### Step 3: Deploy on Render

Render supports two deployment approaches:

#### Option A: Using `render.yaml` (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Select the branch (main/master)
5. Render will automatically detect `render.yaml` and create services
6. Add environment variables in the form (for sensitive data)
7. Click **"Deploy"**

#### Option B: Manual Service Creation

**Create Backend Service:**

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `playknow-backend`
   - **Runtime**: Node
   - **Region**: Choose your closest region
   - **Branch**: main
   - **Build Command**: `npm install`
   - **Start Command**: `node be/server.js`
4. Add environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Generate a secure random string
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `FRONTEND_URL`: https://playknow-frontend.onrender.com (after frontend is deployed)
5. Click **"Create Web Service"**

**Create Frontend Service:**

1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `playknow-frontend`
   - **Region**: Choose your closest region
   - **Branch**: main
   - **Build Command**: `cd fe/vite-project && npm install && npm run build`
   - **Publish Directory**: `fe/vite-project/dist`
4. Add environment variable:
   - `VITE_API_URL`: https://playknow-backend.onrender.com (your backend service URL)
5. Click **"Create Static Site"**

### Step 4: Update Backend Service with Frontend URL

After the frontend is deployed:

1. Go to backend service settings
2. Add/Update environment variable:
   - `FRONTEND_URL`: Your frontend's Render URL
3. Redeploy the backend

## Configuration Details

### Port Configuration

- **Backend**: Runs on port 5000 (configured via `PORT` env variable)
- **Frontend**: Static site served on Render's CDN (no port needed)

### CORS Configuration

The backend is configured to accept requests from:

- `http://localhost:3000`, `http://localhost:5000` (development)
- `http://127.0.0.1:3000`, `http://127.0.0.1:5000` (development)
- Frontend Render URL (production)

### API Endpoint Configuration

The frontend uses:

- **Development**: Relative paths with Vite proxy (`/api/...`)
- **Production**: `VITE_API_URL` environment variable + `/api/...`

## Database Setup

### MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Create a database user
4. Get connection string (should look like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/databasename?retryWrites=true&w=majority
   ```
5. Use this as `MONGODB_URI` in Render

## Cloudinary Setup

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copy your Cloud Name, API Key, and API Secret
3. Use these values for `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

## Deployment Verification

### Test Backend API

Visit: `https://playknow-backend.onrender.com/api/auth/me`

Expected response:

```json
{
  "error": "You are not logged in"
}
```

(This is expected - you're not authenticated)

### Test Frontend

Visit your frontend URL. You should:

1. See the login page
2. Be able to navigate without CORS errors
3. See API calls in browser DevTools Network tab going to your backend

## Troubleshooting

### CORS Errors

**Problem**: `CORS error: Origin not allowed`

**Solution**: Check that your frontend URL is added to the `FRONTEND_URL` environment variable in the backend.

### Build Failures

**Problem**: Frontend or backend build fails

**Solution**:

- Check Render logs: **Dashboard** → **Service** → **Logs**
- Ensure all dependencies are in `package.json`
- Check that build commands are correct

### Database Connection Errors

**Problem**: `Error: connect ECONNREFUSED`

**Solution**:

- Verify `MONGODB_URI` is correct
- Ensure MongoDB IP whitelist includes Render IPs: Use `0.0.0.0/0` (allow all) or check Render's IP ranges
- Test connection locally with a MongoDB client

### API 404 Errors

**Problem**: `/api/*` endpoints return 404

**Solution**:

- Ensure backend service is deployed and running
- Check that `VITE_API_URL` is correctly set in frontend
- Verify backend service is accessible

## Monitoring & Logs

To view logs:

1. Go to **Render Dashboard**
2. Select your service
3. Click **"Logs"** tab
4. View real-time logs

## Scaling & Upgrades

### Upgrade Free Plan

To upgrade from free tier:

1. Go to service settings
2. Click **"Instance Type"**
3. Choose a paid plan (Starter, Standard, etc.)

### Add Persistent Disk (if needed)

For file storage:

1. Service settings
2. Add **Persistent Disk**
3. Specify mount path and size

## Redeploy

To redeploy after code changes:

1. Push changes to GitHub
2. Render automatically redeploys on push

Or manually redeploy:

1. Go to service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

## Environment Management

For different environments (staging, production):

1. Create separate services on Render
2. Connect to different GitHub branches
3. Use different environment variables for each

## Cost Considerations

**Free Tier Limits:**

- Services spin down after 15 minutes of inactivity
- Limited compute resources
- Shared bandwidth

**Recommendations:**

- Start with free tier for testing
- Upgrade to Starter plan for production ($12/service/month)
- Consider Render database offerings for better performance

## Support & Resources

- **Render Documentation**: https://render.com/docs
- **Render Community**: https://render.com/community
- **Report Issues**: https://github.com/Gaur97shiv/playknow/issues

---

## Quick Reference

| Service  | Type    | Port  | URL Pattern                         |
| -------- | ------- | ----- | ----------------------------------- |
| Backend  | Web     | 5000  | https://[service-name].onrender.com |
| Frontend | Static  | -     | https://[service-name].onrender.com |
| Database | MongoDB | 27017 | mongodb+srv://...                   |

## Checklist

- [ ] Code pushed to GitHub
- [ ] `.env.example` created with all required variables
- [ ] `render.yaml` configured
- [ ] MongoDB cluster created and connection string ready
- [ ] Cloudinary account set up with API credentials
- [ ] Backend service created on Render
- [ ] Frontend service created on Render
- [ ] Environment variables added to both services
- [ ] Backend URL updated when frontend is deployed
- [ ] CORS settings verified
- [ ] Both services deployed successfully
- [ ] Test login/signup flow
- [ ] Verify API calls in network tab
