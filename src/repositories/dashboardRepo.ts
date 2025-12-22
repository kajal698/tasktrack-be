


// import { client } from "../utils/pg";

// export const getDashboardSummaryRepo = async () => {
//   /**
//    * 1️⃣ Get projects list
//    */
//   const projectsResult = await client.query(`
//     SELECT *
//     FROM projects
//     ORDER BY created_at DESC
//   `);

//   /**
//    * 2️⃣ Get tasks list
//    */
// const tasksResult = await client.query(`
//   SELECT
//     t.id,
//     t.task,
//     t.project_id,
//     t.status,
//     t.priority,
//     t.created_at,
//     t.updated_at,
//     t.due_date,
//     t.description,
//     t.progress,

//     -- added by user
//     u.id       AS added_by_id,
//     u.username AS added_by_name,
//     u.email    AS added_by_email,

//     -- assigned to user
//     au.id       AS assigned_to_id,
//     au.username AS assigned_to_name,
//     au.email    AS assigned_to_email

//   FROM tasks t
//   LEFT JOIN users u  ON u.id  = t.added_by
//   LEFT JOIN users au ON au.id = t.assigned_to
//   ORDER BY t.created_at DESC
// `);

//   /**
//    * 3️⃣ Get summary counts
//    */
//   const summaryResult = await client.query(`
//     SELECT
//       (SELECT COUNT(*) FROM projects) AS total_projects,
//       (SELECT COUNT(*) FROM tasks) AS total_tasks,
//       (SELECT COUNT(*) FROM tasks WHERE status = 'pending') AS pending,
//       (SELECT COUNT(*) FROM tasks WHERE status = 'in-progress') AS in_progress,
//       (SELECT COUNT(*) FROM tasks WHERE status = 'completed') AS completed
//   `);

//   const summaryRow = summaryResult.rows[0];

//   return {
//     projects: projectsResult.rows,
//     tasks: tasksResult.rows,
//     summary: {
//       totalProjects: Number(summaryRow.total_projects),
//       totalTasks: Number(summaryRow.total_tasks),
//       pending: Number(summaryRow.pending),
//       inProgress: Number(summaryRow.in_progress),
//       completed: Number(summaryRow.completed),
//     },
//   };
// };

import { client } from "../utils/pg";

export const getDashboardSummaryRepo = async () => {
  /**
   * 1️⃣ Projects
   */
  const projectsResult = await client.query(`
    SELECT *
    FROM projects
    ORDER BY created_at DESC
  `);

  /**
   * 2️⃣ Tasks (SAFE JOIN — NO UUID ERRORS)
   */
const tasksResult = await client.query(`
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
    ON u.id = CASE
      WHEN t.added_by IS NOT NULL
       AND t.added_by::text ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      THEN t.added_by::uuid
    END

  LEFT JOIN users au
    ON au.id = CASE
      WHEN t.assigned_to IS NOT NULL
       AND t.assigned_to::text ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      THEN t.assigned_to::uuid
    END

  ORDER BY t.created_at DESC
`);

  /**
   * 3️⃣ Summary
   */
  const summaryResult = await client.query(`
    SELECT
      (SELECT COUNT(*) FROM projects) AS total_projects,
      (SELECT COUNT(*) FROM tasks) AS total_tasks,
      (SELECT COUNT(*) FROM tasks WHERE status = 'pending') AS pending,
      (SELECT COUNT(*) FROM tasks WHERE status = 'in-progress') AS in_progress,
      (SELECT COUNT(*) FROM tasks WHERE status = 'completed') AS completed
  `);

  const summaryRow = summaryResult.rows[0];

  /**
   * 4️⃣ Normalize tasks (clean API)
   */
  const tasks = tasksResult.rows.map((row) => ({
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

  return {
    projects: projectsResult.rows,
    tasks,
    summary: {
      totalProjects: Number(summaryRow.total_projects),
      totalTasks: Number(summaryRow.total_tasks),
      pending: Number(summaryRow.pending),
      inProgress: Number(summaryRow.in_progress),
      completed: Number(summaryRow.completed),
    },
  };
};