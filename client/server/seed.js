import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Car from "./models/Car.js";
import Booking from "./models/Booking.js";
import connectDB from "./config/db.js";

dotenv.config();

// Sample data
const users = [
  {
    name: "Car Owner 1",
    email: "owner1@test.com",
    password: "password123",
    role: "owner",
  },
  {
    name: "Car Owner 2",
    email: "owner2@test.com",
    password: "password123",
    role: "owner",
  },
  {
    name: "John Doe",
    email: "user1@test.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Jane Smith",
    email: "user2@test.com",
    password: "password123",
    role: "user",
  },
];

const cars = [
  {
    brand: "BMW",
    model: "X5",
    image: "/uploads/sample-car-1.jpg",
    year: 2023,
    category: "SUV",
    seating_capacity: 5,
    fuel_type: "Hybrid",
    transmission: "Automatic",
    pricePerDay: 200,
    location: "New York",
    description:
      "Luxury SUV with premium features and advanced safety technology. Perfect for family trips.",
    isAvailable: true,
  },
  {
    brand: "Toyota",
    model: "Camry",
    image: "/uploads/sample-car-2.jpg",
    year: 2023,
    category: "Sedan",
    seating_capacity: 5,
    fuel_type: "Petrol",
    transmission: "Automatic",
    pricePerDay: 100,
    location: "Los Angeles",
    description:
      "Comfortable and reliable sedan, great for city driving and long trips.",
    isAvailable: true,
  },
  {
    brand: "Jeep",
    model: "Wrangler",
    image: "/uploads/sample-car-3.jpg",
    year: 2022,
    category: "SUV",
    seating_capacity: 4,
    fuel_type: "Diesel",
    transmission: "Manual",
    pricePerDay: 150,
    location: "Houston",
    description:
      "Adventure-ready SUV perfect for off-road experiences and outdoor activities.",
    isAvailable: true,
  },
  {
    brand: "Mercedes-Benz",
    model: "S-Class",
    image: "/uploads/sample-car-4.jpg",
    year: 2024,
    category: "Luxury",
    seating_capacity: 5,
    fuel_type: "Hybrid",
    transmission: "Automatic",
    pricePerDay: 350,
    location: "Chicago",
    description:
      "Ultimate luxury sedan with cutting-edge technology and exceptional comfort.",
    isAvailable: true,
  },
  {
    brand: "Honda",
    model: "Civic",
    image: "/uploads/sample-car-5.jpg",
    year: 2023,
    category: "Sedan",
    seating_capacity: 5,
    fuel_type: "Petrol",
    transmission: "Automatic",
    pricePerDay: 80,
    location: "New York",
    description:
      "Efficient and stylish sedan, perfect for daily commuting and weekend trips.",
    isAvailable: true,
  },
  {
    brand: "Ford",
    model: "Mustang",
    image: "/uploads/sample-car-6.jpg",
    year: 2023,
    category: "Luxury",
    seating_capacity: 4,
    fuel_type: "Petrol",
    transmission: "Manual",
    pricePerDay: 180,
    location: "Los Angeles",
    description:
      "Iconic sports car with powerful performance and classic American muscle.",
    isAvailable: true,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Car.deleteMany({});
    await Booking.deleteMany({});
    console.log("✅ Existing data cleared");

    console.log("👥 Creating users...");
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Get owners and users
    const owners = createdUsers.filter((u) => u.role === "owner");
    const regularUsers = createdUsers.filter((u) => u.role === "user");

    console.log("🚗 Creating cars...");
    const carsWithOwners = cars.map((car, index) => ({
      ...car,
      owner: owners[index % owners.length]._id,
    }));
    const createdCars = await Car.insertMany(carsWithOwners);
    console.log(`✅ Created ${createdCars.length} cars`);

    console.log("📅 Creating sample bookings...");
    const bookings = [
      {
        car: createdCars[0]._id,
        user: regularUsers[0]._id,
        owner: owners[0]._id,
        pickupDate: new Date("2024-12-15"),
        returnDate: new Date("2024-12-20"),
        status: "confirmed",
        price: 1000,
      },
      {
        car: createdCars[1]._id,
        user: regularUsers[1]._id,
        owner: owners[1]._id,
        pickupDate: new Date("2024-12-18"),
        returnDate: new Date("2024-12-22"),
        status: "pending",
        price: 400,
      },
      {
        car: createdCars[2]._id,
        user: regularUsers[0]._id,
        owner: owners[0]._id,
        pickupDate: new Date("2024-12-10"),
        returnDate: new Date("2024-12-14"),
        status: "completed",
        price: 600,
      },
    ];
    const createdBookings = await Booking.insertMany(bookings);
    console.log(`✅ Created ${createdBookings.length} bookings`);

    console.log("\n🎉 Database seeded successfully!\n");
    console.log("📋 Test Accounts:");
    console.log("   Owner 1: owner1@test.com / password123");
    console.log("   Owner 2: owner2@test.com / password123");
    console.log("   User 1:  user1@test.com / password123");
    console.log("   User 2:  user2@test.com / password123\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
