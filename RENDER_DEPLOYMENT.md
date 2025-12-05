# RentHub Backend - Render Deployment Guide

## 📋 Prerequisites
- GitHub repository with your code pushed
- MongoDB Atlas account (for database)
- ImageKit account (for image uploads)

## 🚀 Step-by-Step Deployment

### 1. Prepare Your Repository
Your code is already pushed to: `https://github.com/Mohammed-Alif1/RentHub2.git`

### 2. Sign Up/Login to Render
- Go to [https://render.com](https://render.com)
- Sign up or log in with your GitHub account

### 3. Create a New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `Mohammed-Alif1/RentHub2`
3. Configure the service with these settings:

#### Basic Settings
```
Name: renthub-backend
Region: Singapore (or closest to your users)
Branch: main
Root Directory: server
Runtime: Node
```

#### Build & Deploy Settings
```
Build Command: npm install
Start Command: npm start
```

#### Instance Type
```
Free (or select paid plan if needed)
```

### 4. Environment Variables
Click **"Advanced"** → **"Add Environment Variable"** and add these:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
CLIENT_URL=https://your-frontend-url.com
NODE_ENV=production
```

**Important Notes:**
- Replace all placeholder values with your actual credentials
- For `MONGO_URI`: Get this from MongoDB Atlas → Connect → Connect your application
- For `JWT_SECRET`: Use a strong random string (e.g., generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- For `CLIENT_URL`: Add your frontend URL once deployed (or use `*` for testing)

### 5. Deploy
1. Click **"Create Web Service"**
2. Render will automatically build and deploy your backend
3. Wait for the deployment to complete (usually 2-5 minutes)

### 6. Get Your Backend URL
Once deployed, Render will provide you with a URL like:
```
https://renthub-backend.onrender.com
```

### 7. Update Frontend Configuration
Update your frontend to use the Render backend URL instead of `localhost:3000`

## 🔧 MongoDB Atlas Setup (if not done)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP: `0.0.0.0/0` (allows connections from anywhere)
5. Get connection string: **Connect** → **Connect your application**
6. Copy the connection string and replace `<password>` with your database user password

## ✅ Verify Deployment

Test your backend by visiting:
```
https://your-backend-url.onrender.com/
```

You should see: "Server is running"

Test API endpoints:
```
https://your-backend-url.onrender.com/api/user
https://your-backend-url.onrender.com/api/owner
https://your-backend-url.onrender.com/api/bookings
```

## 🔄 Auto-Deploy on Push

Render automatically redeploys when you push to the `main` branch:
```bash
git add .
git commit -m "Update backend"
git push origin main
```

## 📊 Monitor Your Service

- **Logs**: Render Dashboard → Your Service → Logs
- **Metrics**: Check CPU, Memory usage in the dashboard
- **Events**: See deployment history

## ⚠️ Important Notes

### Free Tier Limitations
- Service spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- 750 hours/month free (enough for 1 service running 24/7)

### Upgrade to Paid Plan if you need:
- No spin-down (always active)
- More resources
- Custom domains
- Better performance

## 🐛 Troubleshooting

### Build Fails
- Check logs in Render dashboard
- Ensure `package.json` has correct dependencies
- Verify Node version compatibility

### Database Connection Issues
- Check MongoDB Atlas IP whitelist
- Verify `MONGO_URI` environment variable
- Check database user credentials

### CORS Errors
- Update `CLIENT_URL` environment variable
- Ensure frontend URL is correct

## 📝 Additional Configuration

### Custom Domain (Optional)
1. Go to your service → Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed

### Health Checks (Optional)
Render automatically pings your `/` endpoint to check health.

## 🎉 You're Done!

Your backend is now live on Render! 🚀
