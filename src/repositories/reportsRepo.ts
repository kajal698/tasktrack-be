import { client } from "../utils/pg";

export const getCombinedReportRepo = async (filters: any) => {
  const values: any[] = [];
  let idx = 1;
  const where: string[] = [];

  if (filters.projects) {
    where.push(`t.project_id = ANY($${idx++})`);
    values.push(filters.projects.split(","));
  }

  if (filters.users) {
    where.push(`t.assigned_to = ANY($${idx++})`);
    values.push(filters.users.split(","));
  }

  if (filters.status) {
    where.push(`t.status = $${idx++}`);
    values.push(filters.status);
  }

  if (filters.priority) {
    where.push(`t.priority = $${idx++}`);
    values.push(filters.priority);
  }

  if (filters.from) {
    where.push(`t.created_at::date >= $${idx++}`);
    values.push(filters.from);
  }

  if (filters.to) {
    where.push(`t.created_at::date <= $${idx++}`);
    values.push(filters.to);
  }

  const whereSQL = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const tasks = await client.query(
    `
    SELECT t.*, p.name AS project_name, u.username, u.email
    FROM tasks t
    LEFT JOIN projects p ON p.id = t.project_id
    LEFT JOIN users u ON u.id = t.assigned_to
    ${whereSQL}
    ORDER BY t.created_at DESC
    `,
    values
  );

  return {
    tasks: tasks.rows,
  };
};