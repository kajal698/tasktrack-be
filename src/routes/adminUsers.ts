// import { Router } from "express";
// import { asyncMiddleware } from "../utils/errorHandling";
// import { createUsers, deleteUser, getAllUsers, getProfile, getUserById, updateUser } from "../services/usersService";



// export const adminUserRouter = Router();

// adminUserRouter.get("/profile", asyncMiddleware(getProfile));

// adminUserRouter.get("/", asyncMiddleware(getAllUsers));
// adminUserRouter.post("/", asyncMiddleware(createUsers));

// adminUserRouter.get("/:id", asyncMiddleware(getUserById));
// adminUserRouter.put("/:id", asyncMiddleware(updateUser));
// adminUserRouter.delete("/:id", asyncMiddleware(deleteUser));


import { Router } from "express";
import { asyncMiddleware } from "../utils/errorHandling";
import {
  createUsers,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  getProfile
} from "../services/usersService";
import { verifyToken } from "../utils/authMiddleware";

export const adminUserRouter = Router();

// ✅ PROFILE — MUST BE FIRST
adminUserRouter.get("/profile", verifyToken, asyncMiddleware(getProfile));

// other routes
adminUserRouter.get("/", asyncMiddleware(getAllUsers));
adminUserRouter.post("/", asyncMiddleware(createUsers));

adminUserRouter.get("/:id", asyncMiddleware(getUserById));
adminUserRouter.put("/:id", asyncMiddleware(updateUser));
adminUserRouter.delete("/:id", asyncMiddleware(deleteUser));