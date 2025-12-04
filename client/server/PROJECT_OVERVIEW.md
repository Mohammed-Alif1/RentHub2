# 🚗 Car Rental Platform - Complete Backend System

## 📌 Overview

This is a **production-ready RESTful API backend** for a car rental platform built with **Node.js**, **Express.js**, and **MongoDB**. The system supports complete car rental operations including user authentication, car management, booking system, and owner analytics dashboard.

---

## ✨ Features

### 🔐 Authentication & Authorization

- JWT-based authentication with secure token management
- Role-based access control (User vs Owner)
- Password hashing with bcrypt
- Protected routes with middleware
- Token expiration (7 days)

### 🚙 Car Management

- **CRUD Operations**: Create, Read, Update, Delete cars
- **Image Upload**: Multer integration for car images (5MB limit)
- **Availability Toggle**: Mark cars as available/unavailable
- **Search & Filter**:
  - By location (New York, Los Angeles, Houston, Chicago)
  - By category (Sedan, SUV, Hatchback, Luxury)
  - By price range
  - By keywords (brand, model, description)
- **Owner-specific**: Each owner manages only their cars

### 📅 Booking System

- **Date Validation**: Prevent past dates and invalid date ranges
- **Conflict Detection**: Automatic check for booking conflicts
- **Price Calculation**: Automatic calculation based on rental days
- **Status Management**: pending → confirmed → completed/cancelled
- **User & Owner Views**: Separate endpoints for users and owners
- **Booking Cancellation**: Users can cancel their bookings

### 📊 Owner Dashboard

- **Statistics**:
  - Total cars listed
  - Total bookings received
  - Pending/Confirmed/Completed bookings count
  - Monthly revenue
  - Total revenue
  - Recent bookings list
- **Revenue Analytics**:
  - Daily/Monthly/Yearly breakdown
  - Booking count per period

### 🖼️ File Management

- Image upload with validation
- Automatic file naming with timestamps
- File size limits and type restrictions
- Automatic cleanup on car deletion

---

## 🗂️ Complete Project Structure

```
server/
│
├── config/
│   └── db.js                    # MongoDB connection configuration
│
├── controllers/
│   ├── authController.js        # Register, Login, Profile
│   ├── carController.js         # Car CRUD operations
│   ├── bookingController.js     # Booking management
│   └── dashboardController.js   # Owner statistics & analytics
│
├── middleware/
│   └── auth.js                  # JWT verification & role checking
│
├── models/
│   ├── User.js                  # User schema (users & owners)
│   ├── Car.js                   # Car schema with validations
│   └── Booking.js               # Booking schema with indexes
│
├── routes/
│   ├── authRoutes.js            # /api/auth endpoints
│   ├── carRoutes.js             # /api/cars endpoints
│   ├── bookingRoutes.js         # /api/bookings endpoints
│   └── dashboardRoutes.js       # /api/dashboard endpoints
│
├── uploads/                     # Car images storage directory
│
├── .env                         # Environment variables
├── .gitignore                   # Git ignore file
├── API_COLLECTION.http          # API testing collection
├── package.json                 # Dependencies & scripts
├── README.md                    # Complete API documentation
├── SETUP_GUIDE.md               # Step-by-step setup instructions
├── seed.js                      # Database seeder with sample data
└── server.js                    # Main application entry point
```

---

## 🛠️ Technologies Used

| Technology | Version  | Purpose               |
| ---------- | -------- | --------------------- |
| Node.js    | Latest   | JavaScript runtime    |
| Express.js | ^4.18.2  | Web framework         |
| MongoDB    | Latest   | NoSQL database        |
| Mongoose   | ^8.0.3   | MongoDB ODM           |
| JWT        | ^9.0.2   | Authentication tokens |
| Bcrypt.js  | ^2.4.3   | Password hashing      |
| Multer     | ^1.4.5   | File uploads          |
| CORS       | ^2.8.5   | Cross-origin requests |
| Dotenv     | ^16.3.1  | Environment variables |
| Validator  | ^13.11.0 | Input validation      |

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)

| Endpoint    | Method | Auth | Description              |
| ----------- | ------ | ---- | ------------------------ |
| `/register` | POST   | No   | Register new user/owner  |
| `/login`    | POST   | No   | Login and get JWT token  |
| `/profile`  | GET    | Yes  | Get current user profile |

### Cars (`/api/cars`)

| Endpoint         | Method | Auth | Role  | Description                           |
| ---------------- | ------ | ---- | ----- | ------------------------------------- |
| `/`              | GET    | No   | -     | Get all available cars (with filters) |
| `/:id`           | GET    | No   | -     | Get single car details                |
| `/`              | POST   | Yes  | Owner | Add new car (with image)              |
| `/owner/my-cars` | GET    | Yes  | Owner | Get owner's cars                      |
| `/:id`           | PUT    | Yes  | Owner | Update car details                    |
| `/:id/toggle`    | PATCH  | Yes  | Owner | Toggle availability                   |
| `/:id`           | DELETE | Yes  | Owner | Delete car                            |

### Bookings (`/api/bookings`)

| Endpoint          | Method | Auth | Role  | Description           |
| ----------------- | ------ | ---- | ----- | --------------------- |
| `/`               | POST   | Yes  | User  | Create new booking    |
| `/my-bookings`    | GET    | Yes  | User  | Get user's bookings   |
| `/owner/bookings` | GET    | Yes  | Owner | Get owner's bookings  |
| `/:id`            | GET    | Yes  | Both  | Get booking details   |
| `/:id/status`     | PATCH  | Yes  | Owner | Update booking status |
| `/:id/cancel`     | PATCH  | Yes  | User  | Cancel booking        |
| `/:id`            | DELETE | Yes  | Owner | Delete booking        |

### Dashboard (`/api/dashboard`)

| Endpoint   | Method | Auth | Role  | Description              |
| ---------- | ------ | ---- | ----- | ------------------------ |
| `/stats`   | GET    | Yes  | Owner | Get dashboard statistics |
| `/revenue` | GET    | Yes  | Owner | Get revenue analytics    |

---

## 🗄️ Database Models

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: String (enum: ['user', 'owner'], default: 'user'),
  image: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Car Model

```javascript
{
  owner: ObjectId (ref: User, required),
  brand: String (required),
  model: String (required),
  image: String (required),
  year: Number (required, 1990-2030),
  category: String (enum: ['Sedan', 'SUV', 'Hatchback', 'Luxury']),
  seating_capacity: Number (required, 2-12),
  fuel_type: String (enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric']),
  transmission: String (enum: ['Automatic', 'Manual', 'Semi-Automatic']),
  pricePerDay: Number (required, min: 0),
  location: String (enum: ['New York', 'Los Angeles', 'Houston', 'Chicago']),
  description: String (required),
  isAvailable: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model

```javascript
{
  car: ObjectId (ref: Car, required),
  user: ObjectId (ref: User, required),
  owner: ObjectId (ref: User, required),
  pickupDate: Date (required),
  returnDate: Date (required),
  status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed']),
  price: Number (required, min: 0),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start server (production)
npm start

# Start server (development with auto-reload)
npm run dev

# Seed database with sample data
npm run seed
```

---

## 🔒 Security Features

1. **Password Security**

   - Passwords hashed with bcrypt (salt rounds: 10)
   - Never stored in plain text
   - Password strength validation (min 6 characters)

2. **JWT Security**

   - Secure token generation
   - Token expiration (7 days)
   - Protected routes with middleware
   - Token verification on each request

3. **Input Validation**

   - Email format validation
   - File type validation (images only)
   - File size limits (5MB)
   - Date validation
   - Enum validations for categories

4. **Authorization**
   - Role-based access control
   - Owner verification for car operations
   - User verification for booking operations
   - Ownership verification before delete/update

---

## 🎯 Key Features Explained

### Booking Conflict Prevention

The system automatically checks for date conflicts:

```javascript
// Prevents double-booking on overlapping dates
const conflictingBooking = await Booking.findOne({
  car: carId,
  status: { $in: ["pending", "confirmed"] },
  $or: [
    {
      pickupDate: { $lte: returnDate },
      returnDate: { $gte: pickupDate },
    },
  ],
});
```

### Automatic Price Calculation

```javascript
// Calculates total price based on rental days
const days = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24)) + 1;
const totalPrice = days * car.pricePerDay;
```

### Image Upload Processing

```javascript
// Multer configuration with validation
- File size limit: 5MB
- Allowed types: jpeg, jpg, png, webp
- Unique filename: car-{timestamp}-{random}.ext
- Stored in: /uploads directory
```

---

## 🧪 Testing the API

### 1. Using the Seed Script

```bash
npm run seed
```

This creates:

- 2 Owners (owner1@test.com, owner2@test.com)
- 2 Users (user1@test.com, user2@test.com)
- 6 Sample cars
- 3 Sample bookings
- All passwords: `password123`

### 2. Using API_COLLECTION.http

- Install "REST Client" or "Thunder Client" VS Code extension
- Open `API_COLLECTION.http`
- Click "Send Request" above each endpoint

### 3. Using MongoDB Compass

- Connect to: `mongodb://localhost:27017`
- Database: `car-rental-db`
- View collections: users, cars, bookings

---

## 📊 Sample Response Examples

### Login Response

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Car Owner",
    "email": "owner@test.com",
    "role": "owner"
  }
}
```

### Dashboard Stats Response

```json
{
  "success": true,
  "stats": {
    "totalCars": 6,
    "totalBookings": 12,
    "pendingBookings": 3,
    "completedBookings": 7,
    "confirmedBookings": 2,
    "monthlyRevenue": 3500,
    "totalRevenue": 15800,
    "recentBookings": [...]
  }
}
```

---

## ⚠️ Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

Common HTTP Status Codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

---

## 🔧 Environment Variables

```env
PORT=5000                                    # Server port
MONGODB_URI=mongodb://localhost:27017/...   # MongoDB connection
JWT_SECRET=your_secret_key_here             # JWT signing key
NODE_ENV=development                        # Environment
```

---

## 📝 Important Notes

1. **MongoDB Required**: Install and run MongoDB before starting server
2. **Image Storage**: Car images stored in `/uploads` folder
3. **CORS**: Configured for localhost:5173 and localhost:3000
4. **Token Format**: `Authorization: Bearer <token>`
5. **Date Format**: Use ISO format (YYYY-MM-DD) for dates
6. **File Upload**: Use `multipart/form-data` for car creation/update

---

## 🎓 Best Practices Implemented

- ✅ MVC Architecture (Models, Views, Controllers)
- ✅ RESTful API design
- ✅ Environment variable management
- ✅ Error handling middleware
- ✅ Input validation
- ✅ Password hashing
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ Database indexing for performance
- ✅ File upload handling
- ✅ CORS configuration
- ✅ Consistent API responses

---

## 🔜 Potential Enhancements

- [ ] Email notifications (booking confirmations)
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Car ratings and reviews system
- [ ] Advanced search with multiple filters
- [ ] Favorite/Wishlist functionality
- [ ] SMS notifications
- [ ] Real-time availability updates
- [ ] Image optimization and compression
- [ ] Rate limiting for API endpoints
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] Redis caching for performance

---

## 📞 Support & Documentation

- **README.md** - Complete API reference
- **SETUP_GUIDE.md** - Step-by-step setup instructions
- **API_COLLECTION.http** - Ready-to-use API examples
- **Server logs** - Check console for detailed errors

---

## 📄 License

ISC

---

**Backend is production-ready and fully functional! 🎉**

Connect your frontend to start building the complete car rental platform!
