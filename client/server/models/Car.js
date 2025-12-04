import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1990,
      max: 2030,
    },
    category: {
      type: String,
      required: true,
      enum: ["Sedan", "SUV", "Hatchback", "Luxury"],
    },
    seating_capacity: {
      type: Number,
      required: true,
      min: 2,
      max: 12,
    },
    fuel_type: {
      type: String,
      required: true,
      enum: ["Petrol", "Diesel", "Hybrid", "Electric"],
    },
    transmission: {
      type: String,
      required: true,
      enum: ["Automatic", "Manual", "Semi-Automatic"],
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      enum: ["New York", "Los Angeles", "Houston", "Chicago"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Car = mongoose.model("Car", carSchema);

export default Car;
