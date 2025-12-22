import { Router } from "express";
import { asyncMiddleware } from "../utils/errorHandling";
import { loginUser, registerUser } from "../services/authService";

export const authRouter = Router();

authRouter.post("/signup", asyncMiddleware(registerUser));
authRouter.post("/login", asyncMiddleware(loginUser));   