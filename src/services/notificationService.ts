import { Request, Response } from "express";
import { createNotificationRepo, deleteNotificationRepo, getNotificationRepo, updateNotificationRepo } from "../repositories/notificationRepo";


export const getNotificationList = async (req: Request, res: Response) => {
  try {
    const data = await getNotificationRepo();
    res.json({ data });
  } catch (error: any) {
    throw new Error(`Error fetching notifications: ${error.message}`);
  }
};

export const createNotification = async (req: Request, res: Response) => {
  const { user_id, message, type } = req.body;

  if (!user_id || !message) {
    return res.status(400).json({ error: "user_id and message are required" });
  }

  try {
    const result = await createNotificationRepo({ user_id, message, type });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: `Error creating notification: ${error.message}` });
  }
};

export const updateNotification = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { message, type, is_read } = req.body;

  try {
    const result = await updateNotificationRepo(id, { message, type, is_read });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: `Error updating notification: ${error.message}` });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await deleteNotificationRepo(id);
    res.json({ message: "Notification deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: `Error deleting notification: ${error.message}` });
  }
};
