import { client } from "../utils/pg";


// export const getUserByIdRepo = async (id: string) => {
//   const result = await client.query(
//     "SELECT * FROM users WHERE id = $1",
//     [id]
//   );
//   return result.rows[0];
// };
// export const createUserRepo = async (data: any) => {
//   const {
//     username = "",
//     email = "",
//     projects = null,
//     role = "",
//     added_by = null,
//   } = data;

//   const query = `
//     INSERT INTO users (username, email, projects, role, added_by, created_at, updated_at)
//     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
//     RETURNING *;
//   `;

//   try {
//     const result = await client.query(query, [username, email, projects, role, added_by]);
//     return result.rows[0];
//   } catch (error: any) {
//     throw new Error(`Error creating user: ${error.message}`);
//   }
// };


export const createUserRepo = async (data: any) => {
  const {
    username = "",
    email = "",
    password = "",
    role = "",
    added_by = null,
  } = data;

  const query = `
    INSERT INTO users (username, email, password, role, added_by, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    RETURNING *;
  `;

  try {
    const result = await client.query(query, [
      username,
      email,
      password,
      role,
      added_by
    ]);
    return result.rows[0];
  } catch (error: any) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};


//get all 
export const getAllUsers = async () => {
  const result = await client.query("SELECT * FROM users ORDER BY created_at DESC");
   return result.rows;
}

// Get User by ID
export const getUserByIdRepo = async (id: string) => {
  const result = await client.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};



//update 
export const updateUserRepo = async (id: string, data: any) => {
  const { username, email, password, role, added_by } = data;

  const query = `
    UPDATE users
    SET username = COALESCE($1, username),
        email = COALESCE($2, email),
        password = COALESCE($3, password),
        role = COALESCE($4, role),
        added_by = COALESCE($5, added_by),
        updated_at = NOW()
    WHERE id = $6
    RETURNING *;
  `;

  const result = await client.query(query, [
    username,
    email,
    password,
    role,
    added_by,
    id
  ]);

  return result.rows[0];
};



//delete
export const deleteUserRepo = async (id: string) => {
  const result = await client.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
};