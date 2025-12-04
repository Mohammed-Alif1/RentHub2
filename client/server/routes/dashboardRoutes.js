import express from "express";
import {
  getDashboardStats,
  getRevenueAnalytics,
} from "../controllers/dashboardController.js";
import { authMiddleware, ownerMiddleware } from "../middleware/auth.js";

const dashboardRouter = express.Router();

// Protected routes - Owner only
dashboardRouter.get(
  "/stats",
  authMiddleware,
  ownerMiddleware,
  getDashboardStats
);
dashboardRouter.get(
  "/revenue",
  authMiddleware,
  ownerMiddleware,
  getRevenueAnalytics
);

export default dashboardRouter;
