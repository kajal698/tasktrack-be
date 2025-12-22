import { Router } from "express";
import { asyncMiddleware } from "../utils/errorHandling";
import { createNotification, deleteNotification, getNotificationList, updateNotification } from "../services/notificationService";


export const notificationRouter = Router();

notificationRouter.get("/", asyncMiddleware(getNotificationList));
notificationRouter.post("/", asyncMiddleware(createNotification));
notificationRouter.put("/:id", asyncMiddleware(updateNotification));
notificationRouter.delete("/:id", asyncMiddleware(deleteNotification));
