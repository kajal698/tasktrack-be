import { Response } from "express";
import { AuthRequest } from "../utils/authMiddleware";
import {
  getNotificationsRepo,
  markNotificationReadRepo,
  markAllReadRepo,
  getUnreadCountRepo,
} from "../repositories/notificationsRepo";

// GET /a/notifications
export const getMyNotifications = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const unreadOnly = req.query.unread === "true";

  const notifications = await getNotificationsRepo(userId, unreadOnly);

  res.json({
    data: notifications,
  });
};

// GET /a/notifications/unread-count
export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const count = await getUnreadCountRepo(userId);

  res.json({ count });
};

// PATCH /a/notifications/:id/read
export const markNotificationRead = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const updated = await markNotificationReadRepo(id, userId);

  if (!updated) {
    return res.status(404).json({ message: "Notification not found" });
  }

  res.json({ message: "Notification marked as read" });
};

// PATCH /a/notifications/read-all
export const markAllNotificationsRead = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const updatedCount = await markAllReadRepo(userId);

  res.json({
    message: "All notifications marked as read",
    updated: updatedCount,
  });
};