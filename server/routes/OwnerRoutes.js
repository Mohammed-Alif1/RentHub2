import express from "express";
import { protect } from "../middleware/auth.js";
import { changeRoleToOwner, addCar, getOwnerCars, toggleCarStatus, deleteCar, getDashboardData, updateUserImage } from "../controllers/OwnerController.js";
import upload from "../middleware/multer.js";

// Create an Express Router instance
const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner);
ownerRouter.post("/add-car", upload.single("image"), protect, addCar);
ownerRouter.get("/get-owner-cars", protect, getOwnerCars);
ownerRouter.put("/toggle-car-status/:id", protect, toggleCarStatus);
ownerRouter.delete("/delete-car/:id", protect, deleteCar);
ownerRouter.get("/get-dashboard-data", protect, getDashboardData);

ownerRouter.get("/dashboard-data", protect, getDashboardData);
ownerRouter.put("/update-image", upload.single("image"), protect, updateUserImage);

// Export the router for use in server.js
export default ownerRouter;