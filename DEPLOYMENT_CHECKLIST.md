# Render Deployment Checklist

## Pre-Deployment

- [ ] **Code Repository**
  - [ ] All code pushed to GitHub
  - [ ] Main/master branch is clean
  - [ ] No merge conflicts

- [ ] **Environment & Dependencies**
  - [ ] Node.js >=18.x installed locally
  - [ ] All npm packages installed
  - [ ] Local development works (`npm run dev` for backend)
  - [ ] No console errors in development

## External Services Setup

- [ ] **MongoDB**
  - [ ] MongoDB Atlas account created
  - [ ] Cluster created
  - [ ] Database user created
  - [ ] IP whitelist configured (allow 0.0.0.0/0 or Render IPs)
  - [ ] Connection string copied (mongodb+srv://...)

- [ ] **Cloudinary**
  - [ ] Account created
  - [ ] Cloud Name copied
  - [ ] API Key copied
  - [ ] API Secret copied
  - [ ] Upload preset configured (optional)

## Render Account Setup

- [ ] **Render Account**
  - [ ] Account created at render.com
  - [ ] Email verified
  - [ ] GitHub account connected to Render

## Deployment Configuration

- [ ] **Configuration Files**
  - [ ] `.env.example` reviewed and accurate
  - [ ] `render.yaml` file exists in root
  - [ ] `RENDER_DEPLOYMENT.md` reviewed
  - [ ] All backend routes working in local development

- [ ] **Code Updates**
  - [ ] Backend server.js updated with new port (5000)
  - [ ] CORS configuration updated
  - [ ] Static file serving configured
  - [ ] Vite config updated with VITE_API_URL

## Backend Service Configuration (Before Deploy)

- [ ] **Build Configuration**
  - [ ] Build command: `npm install`
  - [ ] Start command: `node be/server.js`
  - [ ] Region selected

- [ ] **Environment Variables**
  - [ ] `NODE_ENV` = `production`
  - [ ] `MONGODB_URI` = [Your MongoDB URI]
  - [ ] `JWT_SECRET` = [Generated secret key]
  - [ ] `CLOUDINARY_CLOUD_NAME` = [Your value]
  - [ ] `CLOUDINARY_API_KEY` = [Your value]
  - [ ] `CLOUDINARY_API_SECRET` = [Your value]

## Frontend Service Configuration (Before Deploy)

- [ ] **Build Configuration**
  - [ ] Build command: `cd fe/vite-project && npm install && npm run build`
  - [ ] Publish directory: `fe/vite-project/dist`
  - [ ] Region selected (same as backend recommended)

- [ ] **Environment Variables**
  - [ ] `VITE_API_URL` = `https://playknow-backend.onrender.com` (or your custom domain)

## Deployment Steps

### Option A: Using Blueprint (Recommended)

- [ ] **Create Blueprint**
  - [ ] Go to https://dashboard.render.com
  - [ ] Click "New +" → "Blueprint"
  - [ ] Connect GitHub repository
  - [ ] Select branch (main)

- [ ] **Configure Services**
  - [ ] Backend service configured with env vars
  - [ ] Frontend service configured with env vars
  - [ ] Review settings before deployment

- [ ] **Deploy**
  - [ ] Click "Deploy"
  - [ ] Wait for both services to complete
  - [ ] Check service URLs

### Option B: Manual Services

**Backend:**

- [ ] Created Web Service
- [ ] GitHub connected
- [ ] Environment variables set
- [ ] Service deployed successfully
- [ ] Note the service URL (e.g., https://playknow-backend.onrender.com)

**Frontend:**

- [ ] Updated `VITE_API_URL` with backend URL
- [ ] Created Static Site
- [ ] GitHub connected
- [ ] Built and deployed successfully
- [ ] Note the frontend URL (e.g., https://playknow-frontend.onrender.com)

**Backend Update:**

- [ ] Updated backend `FRONTEND_URL` with frontend URL
- [ ] Backend redeployed for CORS settings

## Post-Deployment Verification

### Backend Testing

- [ ] **Service Status**
  - [ ] Backend service shows "Live"
  - [ ] No errors in logs (check Logs tab)
  - [ ] Startup message shows: "Server is running on port 5000"

- [ ] **API Testing**
  - [ ] Can reach: `https://playknow-backend.onrender.com/api/auth/me`
  - [ ] Response is valid JSON (even if error)
  - [ ] Response headers include CORS headers
  - [ ] No 500 errors in logs

- [ ] **Database Connection**
  - [ ] MongoDB connection successful (check logs)
  - [ ] No "ECONNREFUSED" errors
  - [ ] Data can be read/written from backend

### Frontend Testing

- [ ] **Service Status**
  - [ ] Frontend service shows "Live"
  - [ ] Static site is accessible
  - [ ] No build errors in logs

- [ ] **Frontend Functionality**
  - [ ] Can visit `https://playknow-frontend.onrender.com`
  - [ ] Page loads (not 404)
  - [ ] No console errors (check browser DevTools)
  - [ ] CSS and images load correctly

- [ ] **API Integration**
  - [ ] Login page loads
  - [ ] Can attempt login
  - [ ] API requests show in Network tab
  - [ ] API URL is correct (should be backend URL, not frontend)
  - [ ] No CORS errors in console

### Full Flow Testing

- [ ] **User Journey**
  - [ ] Visit login page
  - [ ] Attempt login/signup
  - [ ] Receive error messages (no CORS issues)
  - [ ] Navigation works
  - [ ] Images load from Cloudinary

## Deployment Issues

If deployment fails:

- [ ] **Check Logs**
  - [ ] Backend logs for errors
  - [ ] Frontend build logs for failures
  - [ ] MongoDB connection errors

- [ ] **Verify Variables**
  - [ ] All env vars are set
  - [ ] No typos in variable names
  - [ ] Sensitive data is secure (not in logs)

- [ ] **Common Fixes**
  - [ ] Redeploy service
  - [ ] Check MongoDB whitelist includes 0.0.0.0/0
  - [ ] Verify build commands are exactly correct
  - [ ] Check GitHub branch is correct

## Ongoing Maintenance

- [ ] **Monitoring**
  - [ ] Check logs weekly for errors
  - [ ] Monitor resource usage
  - [ ] Set up alerts for service failures (Render Pro feature)

- [ ] **Updates**
  - [ ] Keep dependencies updated
  - [ ] Security patches applied
  - [ ] Test locally before pushing to main

- [ ] **Data**
  - [ ] Regular database backups (MongoDB Atlas feature)
  - [ ] Monitor storage usage
  - [ ] Plan for scaling if needed

## After Successful Deployment

- [ ] **Share URL**
  - [ ] Frontend URL shared with team
  - [ ] API documentation updated with base URL
  - [ ] Add to project README

- [ ] **Documentation**
  - [ ] Update README with live URL
  - [ ] Document any environment-specific settings
  - [ ] Add deployment troubleshooting tips

- [ ] **Monitoring Setup**
  - [ ] Consider upgrading to paid plan if on free
  - [ ] Set up uptime monitoring
  - [ ] Configure email notifications for failures

## Success Criteria

✅ Backend service is Live and responding to /api/auth/me
✅ Frontend service is Live and website loads
✅ No CORS errors in browser console
✅ API calls are going to Render backend, not localhost
✅ Database is connected and functioning
✅ Can complete basic user flow (login/signup attempt)
✅ All images and assets load correctly
✅ No errors in either service's logs

---

## Quick Reference

| Task                         | Time          | Status |
| ---------------------------- | ------------- | ------ |
| Setup external services      | 15-30 min     | ☐      |
| Create Render account        | 5 min         | ☐      |
| Configure blueprint/services | 10 min        | ☐      |
| Deploy services              | 5-10 min      | ☐      |
| Verify deployment            | 10 min        | ☐      |
| Test full application        | 15 min        | ☐      |
| **Total Deployment Time**    | **60-90 min** | ☐      |

## Support & Troubleshooting

- See `RENDER_DEPLOYMENT.md` for detailed troubleshooting
- Check Render logs: Dashboard → Service → Logs
- Test locally: `npm run dev` in backend root
- Common issues resolved in documentation

---

**Last Updated**: February 16, 2026
**Ready to Deploy**: ✓ All configurations in place
