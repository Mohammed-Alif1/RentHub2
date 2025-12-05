# 🔗 Connecting Vercel Frontend to Render Backend

This guide will help you connect your frontend (deployed on Vercel) with your backend (deployed on Render).

---

## 📋 Overview

- **Frontend**: Deployed on Vercel (`https://your-app.vercel.app`)
- **Backend**: Deployed on Render (`https://your-backend.onrender.com`)
- **Database**: MongoDB Atlas
- **Image Storage**: ImageKit

---

## 🚀 Complete Setup Steps

### **Step 1: Deploy Backend to Render** ✅

Follow the instructions in `RENDER_DEPLOYMENT.md`. Make sure you:

1. Deploy your backend to Render
2. Note down your Render backend URL (e.g., `https://renthub-backend.onrender.com`)
3. Set all environment variables in Render dashboard

**Key Environment Variables for Render:**
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
CLIENT_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

---

### **Step 2: Configure Frontend Environment Variables**

#### **A. Local Development (.env file)**

The `.env` file is already created for you. Update it with your Render backend URL:

```env
VITE_API_URL=https://your-backend-name.onrender.com
VITE_CURRENCY=₹
```

**Example:**
```env
VITE_API_URL=https://renthub-backend.onrender.com
VITE_CURRENCY=₹
```

⚠️ **Important**: 
- Do NOT include a trailing slash
- Replace `your-backend-name` with your actual Render service name

#### **B. Vercel Environment Variables**

You need to add the same environment variables to Vercel:

1. Go to your **Vercel Dashboard**: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_API_URL` | `https://your-backend.onrender.com` | Production, Preview, Development |
| `VITE_CURRENCY` | `₹` | Production, Preview, Development |

**Screenshot Reference:**
```
┌─────────────────────────────────────────────┐
│ Environment Variables                       │
├─────────────────────────────────────────────┤
│ VITE_API_URL                               │
│ https://renthub-backend.onrender.com       │
│ ☑ Production ☑ Preview ☑ Development      │
├─────────────────────────────────────────────┤
│ VITE_CURRENCY                              │
│ ₹                                           │
│ ☑ Production ☑ Preview ☑ Development      │
└─────────────────────────────────────────────┘
```

---

### **Step 3: Update Backend CORS Settings** ✅

Your backend already has CORS configured in `server.js`:

```javascript
const corsOptions = {
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

**Action Required:**
1. Go to your **Render Dashboard**
2. Select your backend service
3. Go to **Environment** tab
4. Update `CLIENT_URL` to your Vercel frontend URL:
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```

If you have multiple frontend URLs (e.g., preview deployments), you can allow all:
```
CLIENT_URL=*
```

Or configure multiple origins in your backend code (see Advanced section below).

---

### **Step 4: Deploy/Redeploy**

#### **Deploy Frontend to Vercel:**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Configure environment variables for production"
   git push origin main
   ```

2. **Vercel will auto-deploy** (if connected to GitHub)

3. **Or manually redeploy** from Vercel Dashboard → Deployments → Redeploy

#### **Redeploy Backend on Render:**

After updating `CLIENT_URL`, Render will automatically redeploy. Or manually:
- Render Dashboard → Your Service → Manual Deploy → Deploy latest commit

---

## ✅ Verification Steps

### **1. Test Backend**
Visit your Render backend URL:
```
https://your-backend.onrender.com/
```
You should see: **"Server is running"**

### **2. Test API Endpoints**
```
GET https://your-backend.onrender.com/api/user/cars
```
Should return data or authentication error (which is okay).

### **3. Test Frontend-Backend Connection**

1. Open your Vercel app: `https://your-app.vercel.app`
2. Open browser DevTools (F12) → Console
3. Check for any CORS errors
4. Try to fetch cars or login

**Expected behavior:**
- ✅ API calls go to Render backend
- ✅ No CORS errors
- ✅ Data loads correctly

### **4. Test Login/Signup Flow**

1. Try creating an account
2. Check if JWT token is stored
3. Verify user data is fetched

---

## 🐛 Common Issues & Solutions

### **Issue 1: CORS Error**

**Error:**
```
Access to fetch at 'https://backend.onrender.com/api/user/cars' 
from origin 'https://your-app.vercel.app' has been blocked by CORS policy
```

**Solution:**
- Update `CLIENT_URL` in Render environment variables
- Make sure it matches your Vercel URL exactly
- Redeploy backend after changing environment variables

---

### **Issue 2: 404 Not Found on API Calls**

**Error:**
```
GET https://your-backend.onrender.com/api/user/cars 404 (Not Found)
```

**Solution:**
- Check if `VITE_API_URL` is set correctly in Vercel
- Verify the backend is actually running on Render
- Check Render logs for errors

---

### **Issue 3: Environment Variables Not Working**

**Symptoms:**
- `import.meta.env.VITE_API_URL` is `undefined`
- API calls fail

**Solution:**
1. **In Vercel**: Add environment variables in dashboard
2. **Redeploy** from Vercel after adding variables
3. **Check naming**: Must start with `VITE_` for Vite to expose them
4. **Clear cache**: Settings → General → Clear Build Cache

---

### **Issue 4: Backend Slow to Respond (First Request)**

**Symptoms:**
- First API call takes 30-60 seconds
- Subsequent calls are fast

**Cause:**
- Render free tier spins down after 15 minutes of inactivity

**Solutions:**
- **Accept it** (free tier limitation)
- **Upgrade to paid plan** ($7/month - always active)
- **Keep-alive service** (ping your backend every 10 minutes)

---

### **Issue 5: Mixed Content (HTTP/HTTPS)**

**Error:**
```
Mixed Content: The page at 'https://your-app.vercel.app' was loaded over HTTPS, 
but requested an insecure resource 'http://...'. This request has been blocked.
```

**Solution:**
- Ensure `VITE_API_URL` uses **HTTPS** (not HTTP)
- Render provides HTTPS by default

---

## 🔧 Advanced Configuration

### **Multiple Frontend URLs (Staging + Production)**

If you have multiple frontend URLs (preview deployments), update your backend CORS:

**In `server/server.js`:**

```javascript
const allowedOrigins = [
    'https://your-app.vercel.app',           // Production
    'https://your-app-preview.vercel.app',   // Preview
    'http://localhost:5173',                  // Local development
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

Or simply allow all Vercel domains:

```javascript
const corsOptions = {
    origin: (origin, callback) => {
        // Allow all vercel.app domains and localhost
        if (!origin || origin.includes('.vercel.app') || origin.includes('localhost')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};
```

---

## 📊 Monitoring

### **Backend Logs (Render)**
- Render Dashboard → Your Service → Logs
- Watch for errors, API calls, database connections

### **Frontend Logs (Vercel)**
- Vercel Dashboard → Your Project → Deployments → View Function Logs
- Check for build errors

### **Network Tab (Browser)**
- F12 → Network tab
- Filter by "Fetch/XHR" to see API calls
- Check status codes, response times

---

## 🎯 Quick Reference

### **Current Configuration:**

```
Frontend Files:
  - client/.env                    (Local environment variables)
  - client/src/context/AppContext.jsx (Uses VITE_API_URL)

Backend Files:
  - server/server.js               (CORS configuration)
  - server/.env                    (Local - NOT deployed)

Deployment:
  - Frontend: Vercel (Auto-deploy from GitHub)
  - Backend: Render (Auto-deploy from GitHub)
  - Database: MongoDB Atlas
```

### **Environment Variables Summary:**

| Where | Variable | Example Value |
|-------|----------|--------------|
| **Vercel** | `VITE_API_URL` | `https://renthub-backend.onrender.com` |
| **Vercel** | `VITE_CURRENCY` | `₹` |
| **Render** | `CLIENT_URL` | `https://your-app.vercel.app` |
| **Render** | `MONGO_URI` | `mongodb+srv://...` |
| **Render** | `JWT_SECRET` | `your-secret-key` |
| **Render** | `IMAGEKIT_PUBLIC_KEY` | `public_...` |
| **Render** | `IMAGEKIT_PRIVATE_KEY` | `private_...` |
| **Render** | `IMAGEKIT_URL_ENDPOINT` | `https://ik.imagekit.io/...` |

---

## ✅ Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Backend environment variables configured in Render
- [ ] Backend URL noted down
- [ ] Frontend `.env` file updated with backend URL
- [ ] Frontend environment variables added to Vercel
- [ ] Backend `CLIENT_URL` updated with Vercel URL
- [ ] Frontend pushed to GitHub
- [ ] Vercel auto-deployed
- [ ] Backend endpoint tested (returns "Server is running")
- [ ] Frontend loads without errors
- [ ] API calls work (check Network tab)
- [ ] Login/signup works
- [ ] Images upload correctly

---

## 🎉 You're All Set!

Your Vercel frontend should now be successfully connected to your Render backend!

**Need Help?**
- Check Render logs for backend errors
- Check Vercel deployment logs for frontend errors
- Use browser DevTools console for client-side errors
- Check Network tab for failed API calls

**Useful Commands:**

```bash
# Test backend locally
cd server
npm run server

# Test frontend locally
cd client
npm run dev

# Deploy changes
git add .
git commit -m "Your message"
git push origin main
```

---

**Happy Deploying! 🚀**
