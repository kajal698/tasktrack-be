

import { Request, Response } from "express";
import { getDashboardSummaryRepo } from "../repositories/dashboardRepo";

export const getDashboardSummary = async (req: Request, res: Response) => {
  const dashboardData = await getDashboardSummaryRepo();

  return res.json({
    data: dashboardData,
  });
};