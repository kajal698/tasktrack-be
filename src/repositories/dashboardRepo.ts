// import { client } from "../utils/pg";

// export const getDashboardSummaryRepo = async () => {
//   const query = `
//     SELECT
//       (SELECT COUNT(*) FROM tasks)                               AS total_tasks,
//       (SELECT COUNT(*) FROM tasks WHERE status = 'pending')     AS pending,
//       (SELECT COUNT(*) FROM tasks WHERE status = 'in-progress') AS in_progress,
//       (SELECT COUNT(*) FROM tasks WHERE status = 'completed')   AS completed,
//       (SELECT COUNT(*) FROM projects)                            AS total_projects;
//   `;

//   const { rows } = await client.query(query);

//   const row = rows[0];

//   return {
//     totalTasks: Number(row.total_tasks),
//     pending: Number(row.pending),
//     inProgress: Number(row.in_progress),
//     completed: Number(row.completed),
//     totalProjects: Number(row.total_projects),
//   };
// };


import { client } from "../utils/pg";

export const getDashboardSummaryRepo = async () => {
  /**
   * 1️⃣ Get projects list
   */
  const projectsResult = await client.query(`
    SELECT *
    FROM projects
    ORDER BY created_at DESC
  `);

  /**
   * 2️⃣ Get tasks list
   */
  const tasksResult = await client.query(`
    SELECT *
    FROM tasks
    ORDER BY created_at DESC
  `);

  /**
   * 3️⃣ Get summary counts
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

  return {
    projects: projectsResult.rows,
    tasks: tasksResult.rows,
    summary: {
      totalProjects: Number(summaryRow.total_projects),
      totalTasks: Number(summaryRow.total_tasks),
      pending: Number(summaryRow.pending),
      inProgress: Number(summaryRow.in_progress),
      completed: Number(summaryRow.completed),
    },
  };
};