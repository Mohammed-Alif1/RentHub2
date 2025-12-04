import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes and attach user data to the request
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;

  // 1. Check for token in headers
  // The header is typically "Bearer TOKEN_STRING"
  if (authHeader && authHeader.startsWith("Bearer")) {
    // Extract the token string (remove "Bearer ")
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    // If no token is found, unauthorized
    return res.json({ success: false, message: "Not authorized, no token" });
  }

  try {
    // 2. Verify and decode the token
    // jwt.verify automatically throws an error if the token is invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Assuming your token payload structure is { userId: '...' }
    const userId = decoded.userId;

    if (!userId) {
      return res.json({ success: false, message: "Not authorized, invalid token" });
    }

    // 3. Find the user by ID from the database
    // .select("-password") excludes the password field from the result
    req.user = await User.findById(userId).select("-password");

    if (!req.user) {
      return res.json({ success: false, message: "Not authorized, user not found" });
    }

    // 4. Move to the next middleware or route handler
    next();
  } catch (error) {
    // Handle verification errors (e.g., token expired, wrong secret)
    console.error("JWT Verification Error:", error.message);
    return res.json({ success: false, message: "Not authorized, token failed" });
  }
};