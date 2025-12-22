import { client } from "../utils/pg";

interface TaskFilter {
  status?: string;
  project_id?: string;
  added_by?: string;
}

// Create task
export const createTasksRepo = async (data: any) => {
    const { task = "", project_id = null, status = "pending", added_by = "", assigned_to = null } = data;

    const query = `
        INSERT INTO tasks (task, project_id, status, added_by, assigned_to)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    const result = await client.query(query, [
        task,
        project_id || null,   // ensure empty string becomes null
        status,
        added_by,
        assigned_to || null,
    ]);
    return result.rows[0];
};


// Get all tasks
// export const getAllTasksRepo = async () => {
//     const result = await client.query("SELECT * FROM tasks ORDER BY created_at DESC");
//     return result.rows;
// };

export const getAllTasksRepo = async (filters?: TaskFilter) => {
  let query = `SELECT * FROM tasks WHERE 1=1`;
  const values: any[] = [];

  if (filters?.status) {
    values.push(filters.status);
    query += ` AND status=$${values.length}`;
  }

  if (filters?.project_id) {
    values.push(filters.project_id);
    query += ` AND project_id=$${values.length}`;
  }

  if (filters?.added_by) {
    values.push(filters.added_by);
    query += ` AND added_by=$${values.length}`;
  }

  query += ` ORDER BY created_at DESC`;

  const result = await client.query(query, values);
  console.log(query, values,filters ,"result")
  return result.rows;
};


// Get task by ID
export const getTaskByIdRepo = async (id: string) => {
    const result = await client.query("SELECT * FROM tasks WHERE id = $1", [id]);
    return result.rows[0];
};

// Update task
export const updateTaskRepo = async (id: string, data: any) => {
    const { task, project_id, status, added_by, assigned_to } = data;

    const query = `
        UPDATE tasks
        SET task = COALESCE($1, task),
            project_id = COALESCE($2, project_id),
            status = COALESCE($3, status),
            added_by = COALESCE($4, added_by),
            assigned_to = COALESCE($5, assigned_to),
            updated_at = NOW()
        WHERE id = $6
        RETURNING *;
    `;

    const result = await client.query(query, [task, project_id, status, added_by, assigned_to, id]);
    return result.rows[0];
};

// Delete task
export const deleteTaskRepo = async (id: string) => {
    const result = await client.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
};
