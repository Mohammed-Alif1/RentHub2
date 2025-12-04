# 🚀 QUICK START - Car Rental Backend

## ⚡ Get Started in 3 Steps

### Step 1: Install & Start MongoDB

**Option A - Install MongoDB Locally:**

```powershell
# Download from: https://www.mongodb.com/try/download/community
# After installation, start service:
net start MongoDB
```

**Option B - Use MongoDB Compass:**

```
Download from: https://www.mongodb.com/products/compass
Connect to: mongodb://localhost:27017
```

**📖 Detailed Instructions**: See `MONGODB_SETUP.md`

---

### Step 2: Start Backend Server

```powershell
# Navigate to server folder
cd "c:\Users\DELL\Desktop\New folder\jithinrenatl\server"

# Start server
npm start
```

**✅ Success Indicators:**

```
✅ MongoDB Connected Successfully
🚀 Server started successfully!
📡 Server running on port 5000
```

**🌐 Test in Browser**: http://localhost:5000

---

### Step 3: Seed Database (Optional)

```powershell
npm run seed
```

**Creates:**

- ✅ 4 Test users (2 owners, 2 users)
- ✅ 6 Sample cars
- ✅ 3 Sample bookings

**Test Login:**

- Email: `owner1@test.com`
- Password: `password123`

---

## 📚 Documentation Files

| File                  | Purpose                      |
| --------------------- | ---------------------------- |
| `README.md`           | Complete API documentation   |
| `SETUP_GUIDE.md`      | Step-by-step setup & testing |
| `MONGODB_SETUP.md`    | MongoDB installation guide   |
| `PROJECT_OVERVIEW.md` | Full project details         |
| `API_COLLECTION.http` | Ready-to-use API examples    |

---

## 🎯 Key Features

✅ **User Authentication** - JWT with role-based access  
✅ **Car Management** - CRUD with image upload  
✅ **Booking System** - Date validation & conflict prevention  
✅ **Owner Dashboard** - Statistics & revenue analytics  
✅ **Search & Filter** - Location, category, price, keywords

---

## 🔗 API Endpoints Summary

### Authentication

- `POST /api/auth/register` - Register user/owner
- `POST /api/auth/login` - Login & get token
- `GET /api/auth/profile` - Get profile (auth required)

### Cars

- `GET /api/cars` - Get all cars (with filters)
- `POST /api/cars` - Add car (owner only)
- `GET /api/cars/owner/my-cars` - Get my cars (owner)
- `PUT /api/cars/:id` - Update car (owner)
- `DELETE /api/cars/:id` - Delete car (owner)

### Bookings

- `POST /api/bookings` - Create booking (user)
- `GET /api/bookings/my-bookings` - My bookings (user)
- `GET /api/bookings/owner/bookings` - My bookings (owner)
- `PATCH /api/bookings/:id/status` - Update status (owner)

### Dashboard

- `GET /api/dashboard/stats` - Statistics (owner)
- `GET /api/dashboard/revenue` - Revenue analytics (owner)

---

## 🧪 Quick Test

### 1. Register Owner

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test Owner",
  "email": "owner@test.com",
  "password": "password123",
  "role": "owner"
}
```

### 2. Login & Get Token

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "owner@test.com",
  "password": "password123"
}
```

**Copy the token from response!**

### 3. Get Dashboard Stats

```bash
GET http://localhost:5000/api/dashboard/stats
Authorization: Bearer <your_token_here>
```

---

## 🛠️ Useful Commands

```powershell
# Start MongoDB
net start MongoDB

# Stop MongoDB
net stop MongoDB

# Start backend (development mode)
npm run dev

# Start backend (production mode)
npm start

# Seed database
npm run seed

# Check MongoDB service
Get-Service MongoDB
```

---

## ⚠️ Common Issues

### MongoDB not connected?

```powershell
# Check if MongoDB is running
Get-Service MongoDB

# If not, start it
net start MongoDB
```

### Port 5000 already in use?

```
Change PORT in .env file:
PORT=5001
```

### Can't find uploads folder?

```
Already created! Located at:
server/uploads/
```

---

## 📱 Testing Tools

### Option 1: VS Code Extensions

- Install "Thunder Client" or "REST Client"
- Use `API_COLLECTION.http` file

### Option 2: MongoDB Compass

- Visual database browser
- Connect: `mongodb://localhost:27017`

### Option 3: Browser

- GET requests only
- Visit: http://localhost:5000/api/cars

---

## 🎓 Project Structure

```
server/
├── config/         # Database configuration
├── controllers/    # Business logic
├── middleware/     # Authentication & validation
├── models/         # MongoDB schemas
├── routes/         # API endpoints
├── uploads/        # Car images
├── .env           # Environment variables
├── server.js      # Main entry point
└── seed.js        # Sample data generator
```

---

## 🔐 Security Features

✅ Password hashing (bcrypt)  
✅ JWT authentication  
✅ Role-based authorization  
✅ Input validation  
✅ File upload restrictions  
✅ CORS protection

---

## 📊 Database Collections

- **users** - User accounts (users & owners)
- **cars** - Car listings with images
- **bookings** - Rental bookings

---

## 🌟 What's Included

✅ Complete REST API  
✅ MongoDB integration  
✅ JWT authentication  
✅ File upload system  
✅ Sample data seeder  
✅ Comprehensive documentation  
✅ API testing collection  
✅ Error handling  
✅ Input validation

---

## 🎉 You're Ready!

Your backend is **production-ready** and fully functional!

**Next Steps:**

1. ✅ Start MongoDB
2. ✅ Run backend server
3. ✅ Test APIs
4. 🚀 Connect your frontend!

**Need Help?**

- Check console logs for errors
- Review documentation files
- Verify MongoDB is running
- Ensure .env is configured

---

**Happy Coding! 🚗💨**

For detailed information, see the documentation files listed above.
