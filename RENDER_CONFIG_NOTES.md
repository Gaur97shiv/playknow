# Render.yaml Configuration for PlayKnow

This file defines how the PlayKnow application is deployed on Render.

## Services Defined

1. **Backend** (Web Service)
   - Runs Express.js API server
   - Port: 5000
   - Serves both API and static frontend files

2. **Frontend** (Static Site)
   - Runs React/Vite app
   - Built to static HTML/CSS/JS
   - Served via Render CDN

## Environment Variables

Keep these secrets secure - never commit them to Git:

- `MONGODB_URI` - Database connection string (get from MongoDB Atlas)
- `JWT_SECRET` - Session token secret (generate a random string)
- `CLOUDINARY_CLOUD_NAME` - Image CDN name
- `CLOUDINARY_API_KEY` - Image CDN API key
- `CLOUDINARY_API_SECRET` - Image CDN API secret
- `FRONTEND_URL` - Frontend domain (set after frontend deploys)

## Deployment

The render.yaml file allows one-click deployment via Render CLI or Web UI:

```bash
# Option 1: Via Web UI (Recommended)
1. Go to https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Select your GitHub repo
4. Render fills in env vars automatically

# Option 2: Via Render CLI
render deploy --repo https://github.com/your-username/playknow
```

## Important Notes

- Backend serves static files as fallback for SPA routing
- Frontend is built during deploy, not the backend build
- Both services need to be running for full functionality
- Update environment variables if you change domain names
