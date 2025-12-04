import express from "express";
import {
  addCar,
  getAllCars,
  getCarById,
  getOwnerCars,
  updateCar,
  toggleCarAvailability,
  deleteCar,
} from "../controllers/carController.js";
import { authMiddleware, ownerMiddleware } from "../middleware/auth.js";
import multer from "multer";
import path from "path";

const carRouter = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "car-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (jpeg, jpg, png, webp)"));
    }
  },
});

// Public routes
carRouter.get("/", getAllCars);
carRouter.get("/:id", getCarById);

// Protected routes (Owner only)
carRouter.post(
  "/",
  authMiddleware,
  ownerMiddleware,
  upload.single("image"),
  addCar
);
carRouter.get("/owner/my-cars", authMiddleware, ownerMiddleware, getOwnerCars);
carRouter.put(
  "/:id",
  authMiddleware,
  ownerMiddleware,
  upload.single("image"),
  updateCar
);
carRouter.patch(
  "/:id/toggle",
  authMiddleware,
  ownerMiddleware,
  toggleCarAvailability
);
carRouter.delete("/:id", authMiddleware, ownerMiddleware, deleteCar);

export default carRouter;
