import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { carId, pickupDate, returnDate } = req.body;

    // Validation
    if (!carId || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: "Car ID, pickup date, and return date are required",
      });
    }

    // Find the car
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Check if car is available
    if (!car.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "This car is currently unavailable",
      });
    }

    // Validate dates
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (pickup < today) {
      return res.status(400).json({
        success: false,
        message: "Pickup date cannot be in the past",
      });
    }

    if (returnD <= pickup) {
      return res.status(400).json({
        success: false,
        message: "Return date must be after pickup date",
      });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      car: carId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        {
          pickupDate: { $lte: returnD },
          returnDate: { $gte: pickup },
        },
      ],
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: "Car is already booked for the selected dates",
      });
    }

    // Calculate total price
    const days = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24)) + 1;
    const totalPrice = days * car.pricePerDay;

    // Create booking
    const booking = new Booking({
      car: carId,
      user: req.userId,
      owner: car.owner,
      pickupDate: pickup,
      returnDate: returnD,
      price: totalPrice,
      status: "pending",
    });

    await booking.save();

    // Populate car and user details
    await booking.populate("car");
    await booking.populate("user", "name email");

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating booking",
    });
  }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate("car")
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get user bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching bookings",
    });
  }
};

// Get owner's bookings
export const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.userId })
      .populate("car")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get owner bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching bookings",
    });
  }
};

// Get single booking
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("car")
      .populate("user", "name email")
      .populate("owner", "name email");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user is authorized to view this booking
    if (
      booking.user._id.toString() !== req.userId &&
      booking.owner._id.toString() !== req.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this booking",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching booking",
    });
  }
};

// Update booking status (Owner only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (
      !status ||
      !["pending", "confirmed", "cancelled", "completed"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid status is required (pending, confirmed, cancelled, completed)",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user is the owner
    if (booking.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this booking",
      });
    }

    booking.status = status;
    await booking.save();

    await booking.populate("car");
    await booking.populate("user", "name email");

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating booking status",
    });
  }
};

// Cancel booking (User can cancel their own booking)
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking",
      });
    }

    // Can only cancel pending or confirmed bookings
    if (!["pending", "confirmed"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel this booking",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while cancelling booking",
    });
  }
};

// Delete booking (Owner only)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user is the owner
    if (booking.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this booking",
      });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Delete booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting booking",
    });
  }
};
