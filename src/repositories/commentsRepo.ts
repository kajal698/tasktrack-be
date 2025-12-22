import { client } from "../utils/pg";

export const createCommentsRepo = async (data: any) => {
  const { task_id = "", comment_text = "", added_by = null } = data;

  const query = `
    INSERT INTO comments (task_id, comment_text, added_by, created_at, updated_at)
    VALUES ($1, $2, $3, NOW(), NOW())
    RETURNING *;
  `;

  try {
    const result = await client.query(query, [task_id, comment_text, added_by]);
    return result.rows[0];
  } catch (error: any) {
    throw new Error(`Error creating comment: ${error.message}`);
  }
};
