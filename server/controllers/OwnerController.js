import User from "../models/User.js";
import fs from "fs";
import imagekit from "../configs/imagekit.js";
import Car from "../models/Cars.js";
import Booking from "../models/bookings.js";


export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });
    res.json({ success: true, message: "Now you can list cars" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// API to List Car
// API to List Car
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    // Client sends individual fields, not a JSON string
    const car = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    // Upload image to ImageKit using v7 API
    const fileBuffer = fs.readFileSync(imageFile.path);
    const base64File = fileBuffer.toString('base64');

    const response = await imagekit.files.upload({
      file: base64File,
      fileName: imageFile.originalname,
      folder: "cars",
    });

    const image = response.url;

    await Car.create({
      ...car,
      owner: _id,
      image,
    });

    // Clean up temporary file
    if (fs.existsSync(imageFile.path)) {
      fs.unlinkSync(imageFile.path);
    }

    res.json({ success: true, message: "Car added successfully" });
  } catch (error) {
    console.log(error.message);
    // Clean up file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.json({ success: false, message: error.message });
  }
};

export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
// API to toggle car status   
export const toggleCarStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.json({ success: false, message: "Car not found" });
    }
    car.isAvailable = !car.isAvailable;
    await car.save();
    res.json({ success: true, message: "Car status toggled successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to delete car   
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const car = await Car.findById(req.params.id);
    //check if car is owned by the user
    if (!car) {
      return res.json({ success: false, message: "Car not found" });
    }
    console.log("User ID:", _id);
    console.log("Car Owner:", car.owner.toString());
    if (car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "You are not authorized to delete this car" });
    }
    await Car.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data   
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (role !== "owner") {
      return res.json({ success: false, message: "You are not authorized to get dashboard data" });
    }
    const cars = await Car.find({ owner: _id });
    const bookings = await Booking.find({ owner: _id }).populate('car').sort({ createdAt: -1 });

    const pendingBookings = bookings.filter((booking) => booking.status === "pending");
    const approvedBookings = bookings.filter((booking) => booking.status === "approved");

    // Calculate monthly revenue (current month's approved bookings)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = bookings
      .filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate.getMonth() === currentMonth &&
          bookingDate.getFullYear() === currentYear &&
          booking.status === "approved";
      })
      .reduce((total, booking) => total + booking.totalAmount, 0);

    // Get recent bookings (limit to 5)
    const recentBookings = bookings.slice(0, 5);

    const getDashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: approvedBookings.length,
      monthlyRevenue: monthlyRevenue,
      recentBookings: recentBookings,
    };
    res.json({ success: true, getDashboardData });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to update user image
export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    const imageFile = req.file;
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!imageFile) {
      return res.json({ success: false, message: "No image provided" });
    }

    // Upload image to ImageKit using v7 API
    const fileBuffer = fs.readFileSync(imageFile.path);
    const base64File = fileBuffer.toString('base64');

    const response = await imagekit.files.upload({
      file: base64File,
      fileName: imageFile.originalname,
      folder: "users",
    });

    const image = response.url;
    user.image = image;
    await user.save();

    // Clean up temporary file
    if (fs.existsSync(imageFile.path)) {
      fs.unlinkSync(imageFile.path);
    }

    res.json({ success: true, message: "User image updated successfully" });
  } catch (error) {
    console.log(error.message);
    // Clean up file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.json({ success: false, message: error.message });
  }
};
