import express from "express";
import { getUserData, loginUser, registerUser, updateProfileImage } from "../controllers/UserController.js";
import { getAllCars } from "../controllers/CarController.js";
import { createBooking } from "../controllers/Bookingcontroller.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/data", protect, getUserData);
userRouter.get("/cars", getAllCars);
userRouter.post("/update-image", protect, upload.single('image'), updateProfileImage);
userRouter.post("/reservation", protect, createBooking);

export default userRouter;