import { Router } from "express";
import { asyncMiddleware } from "../utils/errorHandling";
import { createComments } from "../services/commentsService";


export  const adminCommentsRouter = Router();
adminCommentsRouter.post("/",asyncMiddleware(createComments) )
