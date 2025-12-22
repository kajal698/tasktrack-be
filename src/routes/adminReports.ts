import { Router } from "express";
import { asyncMiddleware } from "../utils/errorHandling";
import { getCombinedReport } from "../services/adminReports";

export const adminReportRouter = Router();

adminReportRouter.get(
  "/combined",
  asyncMiddleware(getCombinedReport)
);