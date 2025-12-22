import { client } from "../utils/pg"; // it is a postgreSQL database connection object, it used to send queries to database


export const createProjectsRepo = async (data: any) => {
  const {name = "", added_by = null } = data;  // we extract fields from the data object, or if filed is 

  const query = `
    INSERT INTO projects (name, added_by, created_at, updated_at)
    VALUES ($1, $2, NOW(), NOW()) 
    RETURNING *;
  `;

  //$1, $2 - parameter placeholders.

// try → Contains the code you want to run normally.
// catch → Runs only if an error occurs inside try. You can then handle it (log it, throw a custom error, etc.).
  try {
    const result = await client.query(query, [name, added_by]);  //sends this sql query to database
    return result.rows[0];  //returns a first row(newly inserted project)
  } catch (error: any) {
    throw new Error(`Error creating project: ${error.message}`);
  }
};



//get all projects
export const getProjectsListRepo = async () => {
  const query = `SELECT * FROM projects ORDER BY created_at DESC;`;
  try {
    const result = await client.query(query);
    return result.rows;  //returns rows which is a array of projects
  } catch (error: any) {
    throw new Error(`Error fetching proejcts: ${error.message}`);
  }
}


// Update project
export const updateprojectsRepo = async (id: string, data: any) => {
  const { name } = data;

  // Fetch existing project first
  const existing = await client.query("SELECT * FROM projects WHERE id = $1", [id]);
  if (existing.rows.length === 0) throw new Error("Project not found");

  const added_by = existing.rows[0].added_by; // preserve existing value

  const query = `
    UPDATE projects
    SET name = $1, added_by = $2, updated_at = NOW()
    WHERE id = $3
    RETURNING *;
  `;

  const result = await client.query(query, [name, added_by, id]);
  return result.rows[0];
};



// delete project
export const deleteprojectsRepo = async (id: string) => {
  const query = `
    DELETE FROM projects
    WHERE id = $1
    RETURNING *;
  `;

  const result = await client.query(query, [id]);

  return result.rows[0]; // null if not found
};


