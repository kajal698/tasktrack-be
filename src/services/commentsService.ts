import {Request, Response} from "express";
import { createUserRepo } from "../repositories/usersRepo";
import { createCommentsRepo } from "../repositories/commentsRepo";


// Create new project
export const createComments = async (req: Request, res: Response) => {
  const { task_id, comment_text, added_by } = req.body;

  if (!task_id) {
    return res.status(400).json({ error: "task_id is required" });
  }

  try {
    
    // const data = { ...req.body };
    const result = await createCommentsRepo({
        task_id,
        comment_text,
        added_by
      });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: `Error createProjects: ${error.message}` });
  }
};

