# MongoDB Setup Instructions for Windows

## 📥 Method 1: Install MongoDB Community Server (Recommended)

### Step 1: Download MongoDB

1. Visit: https://www.mongodb.com/try/download/community
2. Select:
   - **Version**: Latest (8.0 or higher)
   - **Platform**: Windows
   - **Package**: MSI
3. Click **Download**

### Step 2: Install MongoDB

1. **Run the installer** (`.msi` file)
2. Choose **Complete** installation type
3. **Service Configuration**:
   - ✅ Check "Install MongoDB as a Service"
   - Service Name: `MongoDB`
   - Data Directory: `C:\Program Files\MongoDB\Server\8.0\data\`
   - Log Directory: `C:\Program Files\MongoDB\Server\8.0\log\`
4. **Install MongoDB Compass** (optional but recommended):
   - ✅ Check "Install MongoDB Compass"
5. Click **Install**
6. Wait for installation to complete

### Step 3: Verify Installation

Open PowerShell and run:

```powershell
# Check if MongoDB service is running
Get-Service MongoDB

# Expected output:
# Status   Name               DisplayName
# ------   ----               -----------
# Running  MongoDB            MongoDB
```

If not running, start it:

```powershell
net start MongoDB
```

### Step 4: Test MongoDB Connection

```powershell
# Connect to MongoDB shell
mongosh

# You should see:
# Current Mongosh Log ID: ...
# Connecting to: mongodb://127.0.0.1:27017/
# Using MongoDB: 8.0.x
```

Type `exit` to quit the MongoDB shell.

---

## 📥 Method 2: MongoDB Compass Only (GUI Tool)

If you don't want to install the full MongoDB server, you can use MongoDB Atlas (cloud) with Compass:

### Step 1: Install MongoDB Compass

1. Download from: https://www.mongodb.com/products/compass
2. Install the application
3. Launch MongoDB Compass

### Step 2: Connect to Local MongoDB

1. In the connection string field, enter:
   ```
   mongodb://localhost:27017
   ```
2. Click **Connect**

### Step 3: Create Database

1. Click **Create Database**
2. Database Name: `car-rental-db`
3. Collection Name: `users`
4. Click **Create Database**

---

## 🔧 Troubleshooting

### Issue 1: MongoDB Service Not Starting

**Error**: "The MongoDB service is not starting"

**Solution**:

```powershell
# Stop the service if running
net stop MongoDB

# Delete data lock file
Remove-Item "C:\Program Files\MongoDB\Server\8.0\data\mongod.lock" -Force

# Start the service
net start MongoDB
```

### Issue 2: Port 27017 Already in Use

**Solution**:

```powershell
# Find what's using port 27017
netstat -ano | findstr :27017

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Start MongoDB
net start MongoDB
```

### Issue 3: Can't Connect to MongoDB

**Check if MongoDB is running**:

```powershell
# List all MongoDB processes
Get-Process | Where-Object {$_.ProcessName -like "*mongo*"}

# Or check service status
Get-Service MongoDB
```

**Start MongoDB manually** (if service doesn't work):

```powershell
# Navigate to MongoDB bin folder
cd "C:\Program Files\MongoDB\Server\8.0\bin"

# Start MongoDB
.\mongod.exe --dbpath "C:\Program Files\MongoDB\Server\8.0\data"
```

---

## 🌐 Alternative: MongoDB Atlas (Cloud)

If you prefer not to install locally, use MongoDB's free cloud service:

### Step 1: Create Free Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free
3. Create a free M0 cluster

### Step 2: Get Connection String

1. Click **Connect** on your cluster
2. Choose **Connect your application**
3. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
   ```

### Step 3: Update .env File

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/car-rental-db
```

Replace `<username>` and `<password>` with your Atlas credentials.

---

## ✅ Verify Backend Connection

After MongoDB is running:

1. **Start your backend server**:

   ```powershell
   cd "c:\Users\DELL\Desktop\New folder\jithinrenatl\server"
   npm start
   ```

2. **Look for this message**:

   ```
   ✅ MongoDB Connected Successfully
   🚀 Server started successfully!
   ```

3. **If you see connection error**:

   ```
   ❌ MongoDB Connection Error
   ```

   Make sure:

   - MongoDB service is running (`Get-Service MongoDB`)
   - Connection string in `.env` is correct
   - No firewall blocking port 27017

---

## 🎯 Quick Commands Reference

```powershell
# Start MongoDB service
net start MongoDB

# Stop MongoDB service
net stop MongoDB

# Check MongoDB service status
Get-Service MongoDB

# Restart MongoDB service
net stop MongoDB; net start MongoDB

# Connect to MongoDB shell
mongosh

# View all databases
mongosh --eval "show dbs"
```

---

## 📊 Using MongoDB Compass (GUI)

### Connect to Local Database:

1. **Connection String**: `mongodb://localhost:27017`
2. Click **Connect**

### View Your Data:

1. Select database: `car-rental-db`
2. Browse collections:
   - **users** - All registered users
   - **cars** - All car listings
   - **bookings** - All bookings

### Features in Compass:

- **Documents**: View/Edit/Delete documents
- **Schema**: See data structure
- **Explain Plan**: Query performance
- **Indexes**: Manage database indexes
- **Validation**: Add validation rules

---

## 🔐 Security (Optional)

### Enable Authentication:

1. Create admin user:

   ```javascript
   use admin
   db.createUser({
     user: "admin",
     pwd: "strongPassword123",
     roles: ["root"]
   })
   ```

2. Update `.env`:
   ```env
   MONGODB_URI=mongodb://admin:strongPassword123@localhost:27017/car-rental-db?authSource=admin
   ```

---

## 📝 Database Seeding

After MongoDB is connected, populate with sample data:

```powershell
# Run the seeder script
npm run seed
```

This creates:

- 4 Test users (2 owners, 2 regular users)
- 6 Sample cars
- 3 Sample bookings

**Test Accounts**:

- Owner: `owner1@test.com` / `password123`
- User: `user1@test.com` / `password123`

---

## ✨ You're All Set!

MongoDB is now ready for your car rental platform backend! 🎉

**Next Steps**:

1. ✅ MongoDB installed and running
2. ✅ Backend server connected to MongoDB
3. ✅ Database seeded with sample data
4. 🚀 Ready to test APIs!

For API testing, see: **SETUP_GUIDE.md**
