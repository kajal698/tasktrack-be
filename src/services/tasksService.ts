import { Request, Response } from "express";
import { createTasksRepo, deleteTaskRepo, getAllTasksRepo, getTaskByIdRepo, updateTaskRepo } from "../repositories/tasksRepo";
import { AuthRequest } from "../utils/authMiddleware";

// export const createTasks = async (req: Request, res: Response) => {
//   const { task, project_id, status, added_by, assigned_to } = req.body;

//   if (!task) {
//     return res.status(400).json({ error: "task is required" });
//   }

//   try {
//     const result = await createTasksRepo({
//       task,
//       project_id,
//       status,
//       added_by,
//       assigned_to,
//     });
//     res.status(201).json(result);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Create task
export const createTasks = async (req: AuthRequest, res: Response) => {
    const { task, project_id, status = "pending", assigned_to } = req.body;

    // added_by comes from the logged-in user
    const added_by = req.user?.id;

    if (!task || !project_id || !added_by) {
        return res.status(400).json({ error: "task, project_id, and added_by are required" });
    }

    try {
        const newTask = await createTasksRepo({
            task,
            project_id: project_id || null,
            status,
            added_by, // from token
            assigned_to: assigned_to || null,
        });

        res.status(201).json(newTask);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const { status, project_id, added_by } = req.query;

    const tasks = await getAllTasksRepo({
      status: status as string,
      project_id: project_id as string,
      added_by: added_by as string,
    });

    res.json({ data: tasks });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};



// Get all tasks
// export const getAllTasks = async (req: Request, res: Response) => {
//     try {
//         const tasks = await getAllTasksRepo();
//         res.json(tasks);
//     } catch (error: any) {
//         res.status(500).json({ error: error.message });
//     }
// };

// Get task by ID
export const getTaskById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const task = await getTaskByIdRepo(id);
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json(task);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Update task
export const updateTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;

    try {
        const updatedTask = await updateTaskRepo(id, data);
        if (!updatedTask) return res.status(404).json({ message: "Task not found" });
        res.json(updatedTask);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Delete task
export const deleteTask = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedTask = await deleteTaskRepo(id);
        if (!deletedTask) return res.status(404).json({ message: "Task not found" });
        res.json({ message: "Task deleted successfully", task: deletedTask });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
