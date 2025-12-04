import Car from "../models/Car.js";
import fs from "fs";

// Add a new car (Owner only)
export const addCar = async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      pricePerDay,
      category,
      transmission,
      fuel_type,
      seating_capacity,
      location,
      description,
    } = req.body;

    // Validation
    if (
      !brand ||
      !model ||
      !year ||
      !pricePerDay ||
      !category ||
      !transmission ||
      !fuel_type ||
      !seating_capacity ||
      !location ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Car image is required",
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const car = new Car({
      owner: req.userId,
      brand,
      model,
      image: imageUrl,
      year: parseInt(year),
      category,
      seating_capacity: parseInt(seating_capacity),
      fuel_type,
      transmission,
      pricePerDay: parseFloat(pricePerDay),
      location,
      description,
      isAvailable: true,
    });

    await car.save();

    res.status(201).json({
      success: true,
      message: "Car added successfully",
      car,
    });
  } catch (error) {
    console.error("Add car error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding car",
    });
  }
};

// Get all cars (with optional filters)
export const getAllCars = async (req, res) => {
  try {
    const { category, location, search, minPrice, maxPrice } = req.query;

    let filter = { isAvailable: true };

    if (category) filter.category = category;
    if (location) filter.location = location;
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = parseFloat(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = parseFloat(maxPrice);
    }
    if (search) {
      filter.$or = [
        { brand: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const cars = await Car.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cars.length,
      cars,
    });
  } catch (error) {
    console.error("Get cars error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching cars",
    });
  }
};

// Get single car by ID
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate(
      "owner",
      "name email"
    );

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.status(200).json({
      success: true,
      car,
    });
  } catch (error) {
    console.error("Get car error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching car",
    });
  }
};

// Get owner's cars
export const getOwnerCars = async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cars.length,
      cars,
    });
  } catch (error) {
    console.error("Get owner cars error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching owner cars",
    });
  }
};

// Update car
export const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Check if the user is the owner of the car
    if (car.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this car",
      });
    }

    const updateData = { ...req.body };

    // If new image uploaded, update image
    if (req.file) {
      // Delete old image if exists
      if (car.image) {
        const oldImagePath = `./uploads${car.image.split("/uploads")[1]}`;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Car updated successfully",
      car: updatedCar,
    });
  } catch (error) {
    console.error("Update car error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating car",
    });
  }
};

// Toggle car availability
export const toggleCarAvailability = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Check if the user is the owner of the car
    if (car.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this car",
      });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    res.status(200).json({
      success: true,
      message: `Car ${
        car.isAvailable ? "activated" : "deactivated"
      } successfully`,
      car,
    });
  } catch (error) {
    console.error("Toggle availability error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while toggling availability",
    });
  }
};

// Delete car
export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Check if the user is the owner of the car
    if (car.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this car",
      });
    }

    // Delete car image
    if (car.image) {
      const imagePath = `./uploads${car.image.split("/uploads")[1]}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Car.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Car deleted successfully",
    });
  } catch (error) {
    console.error("Delete car error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting car",
    });
  }
};
