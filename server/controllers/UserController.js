import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Car from "../models/Cars.js";
import fs from "fs";
import imagekit from "../configs/imagekit.js";

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Email validation regex
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// ---------------------------------------
// ## 1. Register User
// ---------------------------------------
export const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Sanitize inputs
    name = name.trim();
    email = email.trim().toLowerCase();

    // Email validation
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format." });
    }

    // Password strength validation
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters and include uppercase, lowercase, and a number."
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ name, email, password: hashedPassword });

    // Token
    const token = generateToken(user._id.toString());

    return res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------------------------
// ## 2. Login User
// ---------------------------------------
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Sanitize email
    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid Credentials" });
    }

    const token = generateToken(user._id.toString());

    return res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------------------------
// ## 3. Get User Data (from middleware)
// ---------------------------------------
export const getUserData = async (req, res) => {
  try {
    const { user } = req; // set from auth middleware
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------------------------
// ## 4. Update Profile Image
// ---------------------------------------
export const updateProfileImage = async (req, res) => {
  try {
    const { user } = req; // set from auth middleware

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    // Upload image to ImageKit using v7 API
    const fileBuffer = fs.readFileSync(req.file.path);

    // Convert buffer to base64 for ImageKit v7
    const base64File = fileBuffer.toString('base64');

    const response = await imagekit.files.upload({
      file: base64File,
      fileName: req.file.originalname,
      folder: "users",
    });

    // Use the uploaded file URL directly
    const imageUrl = response.url;

    // Update user's image with ImageKit URL
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { image: imageUrl },
      { new: true }
    ).select('-password');

    // Clean up temporary uploaded file
    fs.unlinkSync(req.file.path);

    return res.json({
      success: true,
      message: "Profile image updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.log("Error in updateProfileImage:", error.message);
    console.log("Full error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Get all cars for the front end
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true });
    return res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

