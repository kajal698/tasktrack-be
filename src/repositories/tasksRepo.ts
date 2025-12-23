import { client } from "../utils/pg";

interface TaskFilter {
  status?: string;
  project_id?: string;
  added_by?: string;
}

// Create task
export const createTasksRepo = async (data: any) => {

  console.log(data, "data")
  const {
    task,
    description = null,
    project_id = null,
    status = "pending",
    added_by,
    assigned_to = null,
    due_date = null,
  } = data;

  const query = `
    INSERT INTO tasks (
      task,
      description,
      project_id,
      status,
      added_by,
      assigned_to,
      due_date
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const result = await client.query(query, [
    task,
    description,
    project_id,
    status,
    added_by,
    assigned_to,
    due_date,
  ]);

  return result.rows[0];
};


// Get all tasks
// export const getAllTasksRepo = async () => {
//     const result = await client.query("SELECT * FROM tasks ORDER BY created_at DESC");
//     return result.rows;
// };

// export const getAllTasksRepo = async (filters?: TaskFilter) => {
//   let query = `SELECT * FROM tasks WHERE 1=1`;
//   const values: any[] = [];

//   if (filters?.status) {
//     values.push(filters.status);
//     query += ` AND status=$${values.length}`;
//   }

//   if (filters?.project_id) {
//     values.push(filters.project_id);
//     query += ` AND project_id=$${values.length}`;
//   }

//   if (filters?.added_by) {
//     values.push(filters.added_by);
//     query += ` AND added_by=$${values.length}`;
//   }

//   query += ` ORDER BY created_at DESC`;

//   const result = await client.query(query, values);
//   console.log(query, values,filters ,"result")
//   return result.rows;
// };
export const getAllTasksRepo = async (filters?: TaskFilter) => {
  let query = `
    SELECT
      t.id,
      t.task,
      t.project_id,
      t.status,
      t.priority,
      t.created_at,
      t.updated_at,
      t.due_date,
      t.description,
      t.progress,

      u.id       AS added_by_id,
      u.username AS added_by_name,
      u.email    AS added_by_email,

      au.id       AS assigned_to_id,
      au.username AS assigned_to_name,
      au.email    AS assigned_to_email

    FROM tasks t
    LEFT JOIN users u
      ON u.id = t.added_by::uuid
    LEFT JOIN users au
      ON au.id = t.assigned_to::uuid
    WHERE 1=1
  `;

  const values: any[] = [];

  // status (text = text)
  if (filters?.status) {
    values.push(filters.status);
    query += ` AND t.status = $${values.length}`;
  }

  // project_id (uuid = string → cast)
  if (filters?.project_id) {
    values.push(filters.project_id);
    query += ` AND t.project_id = $${values.length}::uuid`;
  }

  // added_by (uuid = string → cast)
  if (filters?.added_by) {
    values.push(filters.added_by);
    query += ` AND t.added_by = $${values.length}::uuid`;
  }

  query += ` ORDER BY t.created_at DESC`;

  const result = await client.query(query, values);

  return result.rows.map((row) => ({
    id: row.id,
    task: row.task,
    project_id: row.project_id,
    status: row.status,
    priority: row.priority,
    created_at: row.created_at,
    updated_at: row.updated_at,
    due_date: row.due_date,
    description: row.description,
    progress: row.progress,

    added_by: row.added_by_id
      ? {
          id: row.added_by_id,
          username: row.added_by_name,
          email: row.added_by_email,
        }
      : null,

    assigned_to: row.assigned_to_id
      ? {
          id: row.assigned_to_id,
          username: row.assigned_to_name,
          email: row.assigned_to_email,
        }
      : null,
  }));
};

// Get task by ID
// export const getTaskByIdRepo = async (id: string) => {
//     const result = await client.query("SELECT * FROM tasks WHERE id = $1", [id]);
//     return result.rows[0];
// };


export const getTaskByIdRepo = async (id: string) => {
  const result = await client.query(
    `
    SELECT
      t.*,
      u.id       AS added_by_id,
      u.username AS added_by_name,
      u.email    AS added_by_email,
      au.id       AS assigned_to_id,
      au.username AS assigned_to_name,
      au.email    AS assigned_to_email
    FROM tasks t
    LEFT JOIN users u  ON u.id = t.added_by
    LEFT JOIN users au ON au.id = t.assigned_to
    WHERE t.id = $1
  `,
    [id]
  );

  const row = result.rows[0];
  if (!row) return null;

  return {
    ...row,
    added_by: row.added_by_id
      ? {
          id: row.added_by_id,
          username: row.added_by_name,
          email: row.added_by_email,
        }
      : null,
    assigned_to: row.assigned_to_id
      ? {
          id: row.assigned_to_id,
          username: row.assigned_to_name,
          email: row.assigned_to_email,
        }
      : null,
  };
};

// Update task
// export const updateTaskRepo = async (id: string, data: any) => {
//     const { task, project_id, status, added_by, assigned_to } = data;

//     const query = `
//         UPDATE tasks
//         SET task = COALESCE($1, task),
//             project_id = COALESCE($2, project_id),
//             status = COALESCE($3, status),
//             added_by = COALESCE($4, added_by),
//             assigned_to = COALESCE($5, assigned_to),
//             updated_at = NOW()
//         WHERE id = $6
//         RETURNING *;
//     `;

//     const result = await client.query(query, [task, project_id, status, added_by, assigned_to, id]);
//     return result.rows[0];
// };

export const updateTaskRepo = async (id: string, data: any) => {
  const {
    task,
    description,
    project_id,
    status,
    added_by,
    assigned_to,
    due_date,
  } = data;

  const query = `
    UPDATE tasks
    SET task = COALESCE($1, task),
        description = COALESCE($2, description),
        project_id = COALESCE($3, project_id),
        status = COALESCE($4, status),
        added_by = COALESCE($5, added_by),
        assigned_to = COALESCE($6, assigned_to),
        due_date = COALESCE($7, due_date),
        updated_at = NOW()
    WHERE id = $8
    RETURNING *;
  `;

  const result = await client.query(query, [
    task,
    description,
    project_id,
    status,
    added_by,
    assigned_to,
    due_date,
    id,
  ]);

  return result.rows[0];
};

// Delete task
export const deleteTaskRepo = async (id: string) => {
    const result = await client.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
};
