import { Router } from "express";
import { asyncMiddleware } from "../utils/errorHandling";
import { verifyToken } from "../utils/authMiddleware";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getUnreadCount,
} from "../services/notificationsService";

export const notificationsRouter = Router();

// View notifications
notificationsRouter.get(
  "/",
  verifyToken,
  asyncMiddleware(getMyNotifications)
);

// Unread count (badge)
notificationsRouter.get(
  "/unread-count",
  verifyToken,
  asyncMiddleware(getUnreadCount)
);

// Mark one as read
notificationsRouter.patch(
  "/:id/read",
  verifyToken,
  asyncMiddleware(markNotificationRead)
);

// Mark all as read
notificationsRouter.patch(
  "/read-all",
  verifyToken,
  asyncMiddleware(markAllNotificationsRead)
);