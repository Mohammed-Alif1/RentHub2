import Booking from "../models/bookings.js";
import Car from "../models/Cars.js";

// ---------------------------------------
// ## Get All Cars
// ---------------------------------------
export const getAllCars = async (req, res) => {
    try {
        const { pickupLocation, pickupDate, returnDate } = req.query;

        // 1. Base Query: Only available cars
        let query = { isAvailable: true };

        // 2. Location Filter (Case-insensitive)
        if (pickupLocation) {
            query.location = { $regex: pickupLocation, $options: 'i' };
        }

        // 3. Date Availability Filter
        if (pickupDate && returnDate) {
            const requestedPickup = new Date(pickupDate);
            const requestedReturn = new Date(returnDate);

            // Find bookings that overlap with the requested dates
            const conflictingBookings = await Booking.find({
                $or: [
                    { status: 'approved' }, // Only consider approved bookings as conflicts? Or pending too? Usually pending blocks too to prevent double booking.
                    { status: 'pending' }
                ],
                pickupDate: { $lte: requestedReturn },
                returnDate: { $gte: requestedPickup }
            }).select('car');

            const bookedCarIds = conflictingBookings.map(booking => booking.car);

            // Exclude booked cars
            if (bookedCarIds.length > 0) {
                query._id = { $nin: bookedCarIds };
            }
        }

        const cars = await Car.find(query);
        return res.json({ success: true, cars });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};
