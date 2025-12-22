// import { Response } from "express";
// import { AuthRequest } from "../utils/authMiddleware";
// import { getDashboardSummaryRepo } from "../repositories/dashboardRepo";

// export const getDashboardSummary = async (
//   req: AuthRequest,
//   res: Response
// ) => {
//   const summary = await getDashboardSummaryRepo();
//   res.json(summary);
// };


import { Request, Response } from "express";
import { getDashboardSummaryRepo } from "../repositories/dashboardRepo";

export const getDashboardSummary = async (req: Request, res: Response) => {
  const dashboardData = await getDashboardSummaryRepo();

  return res.json({
    data: dashboardData,
  });
};