import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema(
    {
        user: { type: ObjectId, ref: "User", required: true },
        car: { type: ObjectId, ref: "Car", required: true },
        owner: { type: ObjectId, ref: "User", required: true },
        pickupLocation: { type: String, required: true },
        dropoffLocation: { type: String, required: true },
        pickupDate: { type: Date, required: true },
        returnDate: { type: Date, required: true },
        totalAmount: { type: Number, required: true },
        status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    },
    { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;