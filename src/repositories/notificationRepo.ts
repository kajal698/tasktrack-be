import { client } from "../utils/pg"; // PostgreSQL connection object

// Get Notifications
export const getNotificationRepo = async () => {
  const query = `
    SELECT *
    FROM dummy_notifications
    ORDER BY created_at DESC;
  `;

  try {
    const result = await client.query(query);
    return result.rows;
  } catch (error: any) {
    throw new Error(`Error fetching notifications: ${error.message}`);
  }
};

// Create Notification
export const createNotificationRepo = async (data: any) => {
  const { user_id, message, type } = data;

  const query = `
    INSERT INTO dummy_notifications (user_id, message, type)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  try {
    const result = await client.query(query, [user_id, message, type]);
    return result.rows[0];
  } catch (error: any) {
    throw new Error(`Error creating notification: ${error.message}`);
  }
};

// Update Notification
export const updateNotificationRepo = async (id: string, updateData: any) => {
  const fields: string[] = [];
  const values: any[] = [];
  let i = 1;

  for (const key in updateData) {
    if (updateData[key] !== undefined) {
      fields.push(`${key} = $${i}`);
      values.push(updateData[key]);
      i++;
    }
  }

  values.push(id); // last value is ID

  const query = `
    UPDATE dummy_notifications
    SET ${fields.join(", ")}
    WHERE id = $${i}
    RETURNING *;
  `;

  try {
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error: any) {
    throw new Error(`Error updating notification: ${error.message}`);
  }
};

export const deleteNotificationRepo = async (id: string) => {
  const query = `
    DELETE FROM dummy_notifications
    WHERE id = $1;
  `;

  try {
    await client.query(query, [id]);
  } catch (error: any) {
    throw new Error(`Error deleting notification: ${error.message}`);
  }
};
