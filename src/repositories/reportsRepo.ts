import { client } from "../utils/pg";

export const getCombinedReportRepo = async (filters: any) => {
  const values: any[] = [];
  let idx = 1;
  const where: string[] = [];

  // 🔹 PROJECT FILTER
  if (filters.projects && filters.projects !== "") {
    where.push(`t.project_id = ANY($${idx}::uuid[])`);
    values.push(filters.projects.split(","));
    idx++;
  }

  // 🔹 USER FILTER
  if (filters.users && filters.users !== "") {
    where.push(`t.assigned_to = ANY($${idx}::uuid[])`);
    values.push(filters.users.split(","));
    idx++;
  }

  // 🔹 STATUS FILTER (ignore "all")
  if (filters.status && filters.status !== "all") {
    where.push(`t.status = $${idx}`);
    values.push(filters.status);
    idx++;
  }

  // 🔹 PRIORITY FILTER (ignore "all")
  if (filters.priority && filters.priority !== "all") {
    where.push(`t.priority = $${idx}`);
    values.push(filters.priority);
    idx++;
  }

  // 🔹 FROM DATE
  if (filters.from) {
    where.push(`t.created_at::date >= $${idx}`);
    values.push(filters.from);
    idx++;
  }

  // 🔹 TO DATE
  if (filters.to) {
    where.push(`t.created_at::date <= $${idx}`);
    values.push(filters.to);
    idx++;
  }

  const whereSQL = where.length ? `WHERE ${where.join(" AND ")}` : "";

  /* =======================
     1️⃣ SUMMARY
  ======================= */
  const summaryRes = await client.query(
    `
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
      COUNT(*) FILTER (
        WHERE status != 'completed'
          AND due_date IS NOT NULL
          AND due_date::date < NOW()::date
      )::int AS overdue
    FROM tasks t
    ${whereSQL}
    `,
    values
  );

  /* =======================
     2️⃣ BY STATUS
  ======================= */
  const byStatusRes = await client.query(
    `
    SELECT status, COUNT(*)::int AS count
    FROM tasks t
    ${whereSQL}
    GROUP BY status
    ORDER BY status
    `,
    values
  );

  /* =======================
     3️⃣ BY USER
  ======================= */
  const byUserRes = await client.query(
    `
    SELECT 
      u.id,
      u.username,
      u.email,
      COUNT(t.id)::int AS task_count
    FROM tasks t
    LEFT JOIN users u ON u.id = t.assigned_to
    ${whereSQL}
    GROUP BY u.id, u.username, u.email
    ORDER BY task_count DESC NULLS LAST
    `,
    values
  );

  /* =======================
     4️⃣ BY PROJECT
  ======================= */
  const byProjectRes = await client.query(
    `
    SELECT 
      p.id,
      p.name,
      COUNT(t.id)::int AS task_count
    FROM tasks t
    LEFT JOIN projects p ON p.id = t.project_id
    ${whereSQL}
    GROUP BY p.id, p.name
    ORDER BY task_count DESC NULLS LAST
    `,
    values
  );

  /* =======================
     5️⃣ TASKS LIST
  ======================= */
  const tasksRes = await client.query(
    `
    SELECT
      t.id,
      t.task,
      t.status,
      t.priority,
      t.created_at,
      t.due_date,
      p.name AS project_name,
      u.username,
      u.email
    FROM tasks t
    LEFT JOIN projects p ON p.id = t.project_id
    LEFT JOIN users u ON u.id = t.assigned_to
    ${whereSQL}
    ORDER BY t.created_at DESC
    `,
    values
  );

  return {
    summary: summaryRes.rows[0] || { total: 0, completed: 0, overdue: 0 },
    byStatus: byStatusRes.rows,
    byUser: byUserRes.rows,
    byProject: byProjectRes.rows,
    tasks: tasksRes.rows,
  };
};