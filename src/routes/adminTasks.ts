import { Router } from "express";
import { asyncMiddleware } from "../utils/errorHandling";
import { 
  createTasks, 
  getAllTasks, 
  getTaskById, 
  updateTask, 
  deleteTask 
} from "../services/tasksService";
import { verifyToken } from "../utils/authMiddleware";
// import { verifyToken } from "../middlewares/verifyToken";

export const adminTasksRouter = Router();

// ✅ Create a task (requires login)
adminTasksRouter.post("/", verifyToken, asyncMiddleware(createTasks));

// ✅ Get all tasks (can be public or protected depending on your app)
adminTasksRouter.get("/", verifyToken, asyncMiddleware(getAllTasks));

// ✅ Get task by ID (requires login)
adminTasksRouter.get("/:id", verifyToken, asyncMiddleware(getTaskById));

// ✅ Update task (requires login)
adminTasksRouter.put("/:id", verifyToken, asyncMiddleware(updateTask));

// ✅ Delete task (requires login)
adminTasksRouter.delete("/:id", verifyToken, asyncMiddleware(deleteTask));
