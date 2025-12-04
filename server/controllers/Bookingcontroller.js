import Booking from "../models/bookings.js";
import Car from "../models/Cars.js";

// Function to check if the car is available for a given date
export const checkCarAvailability = async (car, pickupDate, returnDate) => {
    const bookings = await Booking.find({ car: car._id, pickupDate: { $lte: returnDate }, returnDate: { $gte: pickupDate } });
    if (bookings.length > 0) {
        return false;
    }
    return true;
};

// API to check car availability for a given date and location 
export const checkCarAvailabilityForDateAndLocation = async (req, res) => {
    try {
        const { carId, pickupDate, returnDate } = req.body;
        const car = await Car.findById(carId);
        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }
        const isAvailable = await checkCarAvailability(car, pickupDate, returnDate);
        res.json({ success: true, isAvailable });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to book a car
export const createBooking = async (req, res) => {
    try {
        const { carId, pickupDate, returnDate } = req.body;
        const car = await Car.findById(carId);
        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }
        const isAvailable = await checkCarAvailability(car, pickupDate, returnDate);
        if (!isAvailable) {
            return res.json({ success: false, message: "Car is not available for the given date" });
        }

        // Calculate total amount
        const start = new Date(pickupDate);
        const end = new Date(returnDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the pickup day
        const totalAmount = car.pricePerDay * diffDays;

        const booking = await Booking.create({
            user: req.user._id,
            car: carId,
            owner: car.owner,
            pickupDate,
            returnDate,
            pickupLocation: req.body.pickupLocation || car.location,
            dropoffLocation: req.body.dropoffLocation || car.location,
            totalAmount,
            status: "pending",
        });
        res.json({ success: true, booking });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to get all bookings
export const getUserBookings = async (req, res) => {
    try {
        const { _id } = req.user;
        const bookings = await Booking.find({ user: _id }).populate("car").sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to get Owner bookings 
export const getOwnerBookings = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.json({ success: false, message: "You are not authorized to get owner bookings" });
        }
        const { _id } = req.user;
        const bookings = await Booking.find({ owner: _id }).populate("car").sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to  Change booking status
export const changeBookingStatus = async (req, res) => {
    try {
        console.log("changeBookingStatus hit. ID:", req.params.id, "Status:", req.body.status);
        const { _id } = req.user;
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }
        console.log("Booking owner:", booking.owner.toString(), "User ID:", _id.toString());
        if (booking.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "You are not authorized to update this booking" });
        }
        booking.status = req.body.status;
        await booking.save();

        const statusMessage = req.body.status === 'approved'
            ? 'Booking approved successfully! The customer will be notified.'
            : req.body.status === 'rejected'
                ? 'Booking rejected successfully. The customer will be notified.'
                : 'Booking status updated successfully';

        res.json({ success: true, message: statusMessage });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

