# Deployment Guide

## Backend Deployment on Render

### Steps:
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `lamf-lms-backend` (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (or set to root)

5. **Environment Variables** (Add in Render dashboard):
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   ```
   Note: `RENDER_EXTERNAL_URL` is automatically set by Render

6. **Keep-Alive Feature**:
   - The server automatically pings itself every 14 minutes to prevent sleeping
   - This is built into the code and runs automatically in production
   - No additional configuration needed

### Your Backend URL:
https://loan-management-system-xcuu.onrender.com

---

## Frontend Deployment on Vercel

### Steps:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

5. **Environment Variables** (Add in Vercel dashboard):
   ```
   NEXT_PUBLIC_API_URL=https://loan-management-system-xcuu.onrender.com/api
   ```

6. Click "Deploy"

### Your Frontend URL:
https://loan-management-system-beryl.vercel.app

---

## Keep-Alive Mechanism

The backend includes an automatic keep-alive feature that:
- Pings the server every 14 minutes
- Prevents Render free tier from sleeping
- Logs ping activity for monitoring
- Only runs in production environment

The keep-alive endpoint is available at: `/api/keep-alive`

---

## Testing Deployment

1. **Test Backend Health**:
   ```bash
   curl https://loan-management-system-xcuu.onrender.com/api/health
   ```

2. **Test Frontend**:
   - Visit: https://loan-management-system-beryl.vercel.app
   - Try logging in with demo credentials
   - Test all features

3. **Test API**:
   ```bash
   # Get API token
   curl -X POST https://loan-management-system-xcuu.onrender.com/api/auth/api-login \
     -H "Content-Type: application/json" \
     -d '{"clientId":"fintech_client_001","clientSecret":"fintech_secret_123"}'
   ```

---

## Troubleshooting

### Backend Issues:
- Check Render logs for errors
- Verify MongoDB connection string
- Ensure all environment variables are set
- Check if keep-alive is working (check logs)

### Frontend Issues:
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check browser console for CORS errors
- Ensure backend is running and accessible

### CORS Errors:
- Backend CORS is configured to allow Vercel domain
- If you see CORS errors, check backend logs
- Verify the frontend URL matches the CORS configuration

