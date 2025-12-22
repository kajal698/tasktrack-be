import { Request, Response } from "express";
import { getCombinedReportRepo } from "../repositories/reportsRepo";

export const getCombinedReport = async (req: Request, res: Response) => {
  const {
    projects,
    users,
    from,
    to,
    status,
    priority,
  } = req.query;

  const data = await getCombinedReportRepo({
    projects,
    users,
    from,
    to,
    status,
    priority,
  });

  res.json(data);
};