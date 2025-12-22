import { Router } from "express";
import { asyncMiddleware } from "../utils/errorHandling";
import { verifyToken } from "../utils/authMiddleware";
import { getDashboardSummary } from "../services/dashboardService";

export const adminDashboardRouter = Router();

adminDashboardRouter.get(
  "/summary",
  verifyToken,
  asyncMiddleware(getDashboardSummary)
);