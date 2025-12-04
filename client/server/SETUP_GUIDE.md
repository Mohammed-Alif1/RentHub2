# Quick Start Guide - Car Rental Platform Backend

## 🎯 Step-by-Step Setup

### Step 1: Install MongoDB

#### Option A: Using MongoDB Community Server (Recommended)

1. **Download MongoDB:**

   - Visit: https://www.mongodb.com/try/download/community
   - Select Windows, Latest Version
   - Download the MSI installer

2. **Install MongoDB:**

   - Run the installer
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"
   - Check "Install MongoDB Compass" (GUI tool)
   - Complete installation

3. **Verify MongoDB is Running:**

   ```powershell
   # Check if MongoDB service is running
   Get-Service MongoDB

   # If not running, start it
   net start MongoDB
   ```

#### Option B: Using MongoDB Compass Only

1. Download MongoDB Compass from: https://www.mongodb.com/products/compass
2. Install and open Compass
3. Connect to `mongodb://localhost:27017`

### Step 2: Start the Backend Server

```powershell
# Navigate to server directory
cd "c:\Users\DELL\Desktop\New folder\jithinrenatl\server"

# Start the server (development mode with auto-restart)
npm run dev

# OR start in production mode
npm start
```

You should see:

```
✅ MongoDB Connected Successfully
🚀 Server started successfully!
📡 Server running on port 5000
```

### Step 3: Verify Server is Working

Open browser and visit: http://localhost:5000

You should see:

```json
{
  "success": true,
  "message": "Car Rental API Server is running",
  "version": "1.0.0"
}
```

### Step 4: Test API with Sample Data

#### 4.1 Register an Owner Account

**Method:** POST  
**URL:** http://localhost:5000/api/auth/register  
**Body (JSON):**

```json
{
  "name": "Car Owner",
  "email": "owner@test.com",
  "password": "password123",
  "role": "owner"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Car Owner",
    "email": "owner@test.com",
    "role": "owner"
  }
}
```

**📝 IMPORTANT:** Copy the `token` value - you'll need it for authenticated requests!

#### 4.2 Register a Regular User

**Method:** POST  
**URL:** http://localhost:5000/api/auth/register  
**Body (JSON):**

```json
{
  "name": "John Doe",
  "email": "user@test.com",
  "password": "password123",
  "role": "user"
}
```

#### 4.3 Add a Car (Owner Only)

**Method:** POST  
**URL:** http://localhost:5000/api/cars  
**Headers:**

```
Authorization: Bearer <paste_your_token_here>
```

**Body (form-data):**

- brand: `Toyota`
- model: `Camry`
- year: `2023`
- pricePerDay: `100`
- category: `Sedan`
- transmission: `Automatic`
- fuel_type: `Petrol`
- seating_capacity: `5`
- location: `New York`
- description: `Comfortable and reliable sedan`
- image: [Select a car image file]

#### 4.4 Get All Cars

**Method:** GET  
**URL:** http://localhost:5000/api/cars  
**No authentication required**

#### 4.5 Create a Booking (User)

**Method:** POST  
**URL:** http://localhost:5000/api/bookings  
**Headers:**

```
Authorization: Bearer <user_token>
```

**Body (JSON):**

```json
{
  "carId": "<paste_car_id_from_step_4.4>",
  "pickupDate": "2024-12-15",
  "returnDate": "2024-12-20"
}
```

#### 4.6 Get Dashboard Stats (Owner)

**Method:** GET  
**URL:** http://localhost:5000/api/dashboard/stats  
**Headers:**

```
Authorization: Bearer <owner_token>
```

## 🛠️ Tools for Testing APIs

### Option 1: VS Code Thunder Client Extension

1. Install "Thunder Client" extension in VS Code
2. Create new requests using the examples above

### Option 2: Postman

1. Download from: https://www.postman.com/downloads/
2. Import requests using the examples above

### Option 3: Browser (for GET requests only)

- Visit URLs directly in browser
- For POST/PUT/DELETE, use Thunder Client or Postman

## 🔍 Checking Your Database

### Using MongoDB Compass:

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Select database: `car-rental-db`
4. You'll see three collections:
   - `users` - All registered users
   - `cars` - All car listings
   - `bookings` - All bookings

## ❌ Common Issues & Solutions

### Issue 1: MongoDB Not Connected

**Error:** `❌ MongoDB Connection Error`

**Solution:**

```powershell
# Start MongoDB service
net start MongoDB

# Or check if it's running
Get-Service MongoDB
```

### Issue 2: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**

```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change port in .env file
PORT=5001
```

### Issue 3: Token Invalid

**Error:** `Invalid or expired token`

**Solution:**

- Make sure you're including the token in headers
- Format: `Authorization: Bearer <token>`
- Token expires after 7 days - login again to get new token

### Issue 4: File Upload Fails

**Error:** File upload errors

**Solution:**

- Make sure `uploads` folder exists
- Check file is an image (jpg, png, webp)
- File size should be under 5MB

## 📊 Database Schema Overview

### Users

- Stores user accounts (both customers and car owners)
- Passwords are hashed for security
- Role-based access control

### Cars

- Each car belongs to an owner (user with role='owner')
- Contains all car details and pricing
- Images stored in `/uploads` folder

### Bookings

- Links users to cars they want to rent
- Tracks dates, prices, and status
- Prevents double-booking on same dates

## 🎓 API Usage Examples

### Search Cars by Location

GET `http://localhost:5000/api/cars?location=New York`

### Search Cars by Category

GET `http://localhost:5000/api/cars?category=SUV`

### Search Cars by Price Range

GET `http://localhost:5000/api/cars?minPrice=50&maxPrice=150`

### Search Cars by Keyword

GET `http://localhost:5000/api/cars?search=Toyota`

### Get User's Bookings

GET `http://localhost:5000/api/bookings/my-bookings`  
Headers: `Authorization: Bearer <user_token>`

### Get Owner's Bookings

GET `http://localhost:5000/api/bookings/owner/bookings`  
Headers: `Authorization: Bearer <owner_token>`

### Update Booking Status (Owner)

PATCH `http://localhost:5000/api/bookings/<booking_id>/status`  
Headers: `Authorization: Bearer <owner_token>`  
Body:

```json
{
  "status": "confirmed"
}
```

### Cancel Booking (User)

PATCH `http://localhost:5000/api/bookings/<booking_id>/cancel`  
Headers: `Authorization: Bearer <user_token>`

## 🚀 Next Steps

1. **Connect Frontend:**

   - Update frontend API calls to point to `http://localhost:5000`
   - Use the token from login for authenticated requests
   - Handle image uploads in car creation forms

2. **Test All Features:**

   - Register users with different roles
   - Add multiple cars
   - Create bookings
   - Test owner dashboard

3. **Production Deployment:**
   - Change JWT_SECRET in .env
   - Set up MongoDB Atlas (cloud database)
   - Deploy to hosting service (Heroku, Railway, etc.)

## 📞 Need Help?

- Check server console for error logs
- Verify MongoDB is running
- Ensure all required fields are provided
- Check token is valid and not expired

---

**Your backend is ready! Start testing the APIs! 🎉**
