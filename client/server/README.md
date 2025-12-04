# Car Rental Platform - Backend API

A complete RESTful API backend for a car rental platform built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access (user/owner)
- **Car Management**: Full CRUD operations for car listings with image upload
- **Booking System**: Complete booking flow with date validation and conflict checking
- **Owner Dashboard**: Analytics and statistics for car owners
- **File Upload**: Multer integration for car images
- **Data Validation**: Comprehensive input validation
- **Error Handling**: Centralized error handling

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher) installed
- **MongoDB** installed and running
- **MongoDB Compass** (optional, for GUI database management)

## 🛠️ Installation

### 1. Install MongoDB

If you don't have MongoDB installed:

**Windows:**

1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. MongoDB will typically install at `C:\Program Files\MongoDB\Server\[version]\bin`

**Start MongoDB:**

```powershell
# Start MongoDB service
net start MongoDB

# Or run mongod directly
mongod
```

### 2. Install MongoDB Compass (Optional)

Download from [mongodb.com/products/compass](https://www.mongodb.com/products/compass)

Connect to: `mongodb://localhost:27017`

### 3. Install Dependencies

```bash
cd server
npm install
```

## ⚙️ Configuration

The `.env` file is already configured with default settings:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/car-rental-db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_123456789
NODE_ENV=development
```

**Important:** Change the `JWT_SECRET` in production!

## 🏃 Running the Server

### Development Mode (with auto-restart):

```bash
npm run dev
```

### Production Mode:

```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint             | Description       | Auth Required |
| ------ | -------------------- | ----------------- | ------------- |
| POST   | `/api/auth/register` | Register new user | No            |
| POST   | `/api/auth/login`    | Login user        | No            |
| GET    | `/api/auth/profile`  | Get user profile  | Yes           |

**Register/Login Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // or "owner"
}
```

### Cars (`/api/cars`)

| Method | Endpoint                  | Description            | Auth Required | Role  |
| ------ | ------------------------- | ---------------------- | ------------- | ----- |
| GET    | `/api/cars`               | Get all available cars | No            | -     |
| GET    | `/api/cars/:id`           | Get car by ID          | No            | -     |
| POST   | `/api/cars`               | Add new car            | Yes           | Owner |
| GET    | `/api/cars/owner/my-cars` | Get owner's cars       | Yes           | Owner |
| PUT    | `/api/cars/:id`           | Update car             | Yes           | Owner |
| PATCH  | `/api/cars/:id/toggle`    | Toggle availability    | Yes           | Owner |
| DELETE | `/api/cars/:id`           | Delete car             | Yes           | Owner |

**Add Car (multipart/form-data):**

```
brand: BMW
model: X5
year: 2023
pricePerDay: 150
category: SUV
transmission: Automatic
fuel_type: Hybrid
seating_capacity: 5
location: New York
description: Luxury SUV...
image: [file]
```

**Query Parameters for GET /api/cars:**

- `category` - Filter by category
- `location` - Filter by location
- `search` - Search in brand/model/description
- `minPrice` - Minimum price per day
- `maxPrice` - Maximum price per day

### Bookings (`/api/bookings`)

| Method | Endpoint                       | Description           | Auth Required | Role       |
| ------ | ------------------------------ | --------------------- | ------------- | ---------- |
| POST   | `/api/bookings`                | Create booking        | Yes           | User       |
| GET    | `/api/bookings/my-bookings`    | Get user bookings     | Yes           | User       |
| GET    | `/api/bookings/owner/bookings` | Get owner bookings    | Yes           | Owner      |
| GET    | `/api/bookings/:id`            | Get booking by ID     | Yes           | User/Owner |
| PATCH  | `/api/bookings/:id/status`     | Update booking status | Yes           | Owner      |
| PATCH  | `/api/bookings/:id/cancel`     | Cancel booking        | Yes           | User       |
| DELETE | `/api/bookings/:id`            | Delete booking        | Yes           | Owner      |

**Create Booking Body:**

```json
{
  "carId": "car_id_here",
  "pickupDate": "2024-12-15",
  "returnDate": "2024-12-20"
}
```

**Update Status Body:**

```json
{
  "status": "confirmed" // pending, confirmed, cancelled, completed
}
```

### Dashboard (`/api/dashboard`)

| Method | Endpoint                 | Description              | Auth Required | Role  |
| ------ | ------------------------ | ------------------------ | ------------- | ----- |
| GET    | `/api/dashboard/stats`   | Get dashboard statistics | Yes           | Owner |
| GET    | `/api/dashboard/revenue` | Get revenue analytics    | Yes           | Owner |

**Dashboard Stats Response:**

```json
{
  "success": true,
  "stats": {
    "totalCars": 10,
    "totalBookings": 25,
    "pendingBookings": 5,
    "completedBookings": 15,
    "confirmedBookings": 5,
    "monthlyRevenue": 5000,
    "totalRevenue": 25000,
    "recentBookings": [...]
  }
}
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

**How to authenticate:**

1. Register or login to get a token
2. Include the token in request headers:

```
Authorization: Bearer <your_token_here>
```

## 📁 Project Structure

```
server/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── carController.js    # Car management logic
│   ├── bookingController.js # Booking logic
│   └── dashboardController.js # Dashboard statistics
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── models/
│   ├── User.js            # User schema
│   ├── Car.js             # Car schema
│   └── Booking.js         # Booking schema
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   ├── carRoutes.js       # Car endpoints
│   ├── bookingRoutes.js   # Booking endpoints
│   └── dashboardRoutes.js # Dashboard endpoints
├── uploads/               # Car images storage
├── .env                   # Environment variables
├── .gitignore
├── package.json
├── server.js              # Main server file
└── README.md
```

## 🗄️ Database Schema

### User Collection

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'owner']),
  image: String,
  timestamps: true
}
```

### Car Collection

```javascript
{
  owner: ObjectId (ref: User),
  brand: String,
  model: String,
  image: String,
  year: Number,
  category: String (enum: ['Sedan', 'SUV', 'Hatchback', 'Luxury']),
  seating_capacity: Number,
  fuel_type: String (enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric']),
  transmission: String (enum: ['Automatic', 'Manual', 'Semi-Automatic']),
  pricePerDay: Number,
  location: String (enum: ['New York', 'Los Angeles', 'Houston', 'Chicago']),
  description: String,
  isAvailable: Boolean,
  timestamps: true
}
```

### Booking Collection

```javascript
{
  car: ObjectId (ref: Car),
  user: ObjectId (ref: User),
  owner: ObjectId (ref: User),
  pickupDate: Date,
  returnDate: Date,
  status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed']),
  price: Number,
  timestamps: true
}
```

## 🧪 Testing the API

### Using MongoDB Compass:

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. You'll see the database `car-rental-db` after creating the first record
4. Browse collections: `users`, `cars`, `bookings`

### Using Postman or Thunder Client:

1. **Register a User:**

   - POST `http://localhost:5000/api/auth/register`
   - Body (JSON):
     ```json
     {
       "name": "Test Owner",
       "email": "owner@test.com",
       "password": "password123",
       "role": "owner"
     }
     ```

2. **Login:**

   - POST `http://localhost:5000/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "owner@test.com",
       "password": "password123"
     }
     ```
   - Copy the token from response

3. **Add a Car:**

   - POST `http://localhost:5000/api/cars`
   - Headers: `Authorization: Bearer <token>`
   - Body (form-data):
     - brand: Toyota
     - model: Camry
     - year: 2023
     - pricePerDay: 100
     - category: Sedan
     - transmission: Automatic
     - fuel_type: Petrol
     - seating_capacity: 5
     - location: New York
     - description: Comfortable sedan
     - image: [upload file]

4. **Get All Cars:**
   - GET `http://localhost:5000/api/cars`

## 🔧 Troubleshooting

### MongoDB Connection Error:

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:** Make sure MongoDB is running. Start it with:

```powershell
net start MongoDB
```

### Port Already in Use:

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:** Change the PORT in `.env` file or kill the process using port 5000.

### Upload Folder Error:

**Solution:** Make sure the `uploads` folder exists in the server directory.

## 📝 Important Notes

1. **File Uploads:** Car images are stored in `/uploads` directory
2. **CORS:** Currently configured for `localhost:5173` and `localhost:3000`
3. **JWT Expiry:** Tokens expire after 7 days
4. **Password Hashing:** All passwords are hashed using bcrypt
5. **Booking Validation:**
   - Cannot book past dates
   - Cannot book conflicting dates
   - Return date must be after pickup date

## 🔜 Future Enhancements

- Payment gateway integration
- Email notifications
- Car ratings and reviews
- Advanced search filters
- Image optimization
- Rate limiting
- API documentation (Swagger)

## 📄 License

ISC

## 👨‍💻 Support

For issues or questions, please check the console logs for detailed error messages.

---

**Happy Coding! 🚗💨**
