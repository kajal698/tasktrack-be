import { client } from "../utils/pg";

// Get notifications
export const getNotificationsRepo = async (
  userId: string,
  unreadOnly: boolean
) => {
  const query = `
    SELECT *
    FROM notifications
    WHERE user_id = $1
      AND ($2 = false OR is_read = false)
    ORDER BY created_at DESC
  `;

  const result = await client.query(query, [userId, unreadOnly]);
  return result.rows;
};

// Unread count
export const getUnreadCountRepo = async (userId: string) => {
  const result = await client.query(
    `
    SELECT COUNT(*)::int AS count
    FROM notifications
    WHERE user_id = $1 AND is_read = false
  `,
    [userId]
  );

  return result.rows[0].count;
};

// Mark one read
export const markNotificationReadRepo = async (
  notificationId: string,
  userId: string
) => {
  const result = await client.query(
    `
    UPDATE notifications
    SET is_read = true
    WHERE id = $1 AND user_id = $2
    RETURNING id
  `,
    [notificationId, userId]
  );

  return result.rows[0];
};

// Mark all read
export const markAllReadRepo = async (userId: string) => {
  const result = await client.query(
    `
    UPDATE notifications
    SET is_read = true
    WHERE user_id = $1 AND is_read = false
  `,
    [userId]
  );

  return result.rowCount;
};