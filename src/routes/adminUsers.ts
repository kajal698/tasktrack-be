import { Router } from "express";
import { asyncMiddleware } from "../utils/errorHandling";
import { createUsers, deleteUser, getAllUsers, getUserById, updateUser } from "../services/usersService";



export const adminUserRouter = Router();
adminUserRouter.get("/", asyncMiddleware(getAllUsers));
adminUserRouter.post("/", asyncMiddleware(createUsers));

adminUserRouter.get("/:id", asyncMiddleware(getUserById));
adminUserRouter.put("/:id", asyncMiddleware(updateUser));
adminUserRouter.delete("/:id", asyncMiddleware(deleteUser));