# Environment Variables Setup Guide

## Problem
The frontend was getting 404 errors when trying to login/signup because it was pointing to `localhost` instead of the deployed backend.

## Solution - Dual Environment Support

### 1. Backend CORS Configuration (server.js)
The server now supports **both** local development and production:

```javascript
const allowedOrigins = [
    "http://localhost:5173",  // Local Vite dev server
    "https://rent-hub2.vercel.app"  // Production Vercel deployment
];
```

This means:
- ✅ You can develop locally without changing CORS settings
- ✅ Production deployment works automatically
- ✅ No need to switch configurations between environments

### 2. Frontend Environment Variables

#### Local Development (.env file)
For local development, your `client/.env` should be:
```
VITE_CURRENCY=₹
VITE_API_URL=http://localhost:3000
```

#### Production Deployment (Vercel Dashboard)
You MUST set environment variables in Vercel Dashboard:

1. Go to https://vercel.com/dashboard
2. Select your project (rent-hub2)
3. Go to **Settings** → **Environment Variables**
4. Add the following:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://renthub2.onrender.com`
   - **Environment**: Select all (Production, Preview, Development)
5. **Important**: After adding the environment variable, you must **redeploy** your application

### 3. Render Backend
Make sure your Render backend is running at: `https://renthub2.onrender.com`

The backend CORS is already configured to accept requests from Vercel.

## Testing

### Local Development
1. Start backend: `cd server && npm run server`
2. Start frontend: `cd client && npm run dev`
3. Open: http://localhost:5173
4. Test login/signup

### Production
1. Check if backend is running: https://renthub2.onrender.com/
2. Test login endpoint: https://renthub2.onrender.com/api/user/login
3. Make sure Vercel environment variables are set
4. Redeploy frontend on Vercel
5. Test login/signup on: https://rent-hub2.vercel.app

## Important Notes
- ✅ The backend now accepts requests from both localhost and Vercel
- ✅ The `.env` file is for local development only
- ✅ Vercel uses its own environment variables from the dashboard
- ✅ Always redeploy after changing environment variables
- ⚠️ Never commit `.env` files to Git (they're in .gitignore)
- ⚠️ When deploying backend to Render, make sure the CORS configuration is included
