import express from "express";
import {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  deleteBooking,
} from "../controllers/bookingController.js";
import { authMiddleware, ownerMiddleware } from "../middleware/auth.js";

const bookingRouter = express.Router();

// Protected routes - User
bookingRouter.post("/", authMiddleware, createBooking);
bookingRouter.get("/my-bookings", authMiddleware, getUserBookings);
bookingRouter.get("/:id", authMiddleware, getBookingById);
bookingRouter.patch("/:id/cancel", authMiddleware, cancelBooking);

// Protected routes - Owner
bookingRouter.get(
  "/owner/bookings",
  authMiddleware,
  ownerMiddleware,
  getOwnerBookings
);
bookingRouter.patch(
  "/:id/status",
  authMiddleware,
  ownerMiddleware,
  updateBookingStatus
);
bookingRouter.delete("/:id", authMiddleware, ownerMiddleware, deleteBooking);

export default bookingRouter;
