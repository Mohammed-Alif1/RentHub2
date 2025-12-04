import express from "express";
import { checkCarAvailabilityForDateAndLocation, createBooking, getUserBookings, getOwnerBookings, changeBookingStatus } from "../controllers/Bookingcontroller.js";
import { protect } from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkCarAvailabilityForDateAndLocation);
bookingRouter.post("/create-booking", protect, createBooking);
bookingRouter.get("/user-bookings", protect, getUserBookings);
bookingRouter.get("/owner-bookings", protect, getOwnerBookings);
bookingRouter.put("/change-status/:id", protect, changeBookingStatus);

export default bookingRouter;