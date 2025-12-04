import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import carRouter from "./routes/carRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";

// Load environment variables
dotenv.config();

// ES module __dirname alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/cars", carRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/dashboard", dashboardRouter);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Car Rental API Server is running",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      cars: "/api/cars",
      bookings: "/api/bookings",
      dashboard: "/api/dashboard",
    },
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server started successfully!`);
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`\n🔗 Available endpoints:`);
  console.log(`   - Auth:      http://localhost:${PORT}/api/auth`);
  console.log(`   - Cars:      http://localhost:${PORT}/api/cars`);
  console.log(`   - Bookings:  http://localhost:${PORT}/api/bookings`);
  console.log(`   - Dashboard: http://localhost:${PORT}/api/dashboard`);
  console.log(
    `\n💡 Make sure MongoDB is running on ${process.env.MONGODB_URI}\n`
  );
});

export default app;
