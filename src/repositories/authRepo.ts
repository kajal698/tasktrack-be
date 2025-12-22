import { client } from "../utils/pg";

export const createUserRepo = async (username: string, email: string, hashedPassword: string, role: string) => {
  const query = `
    INSERT INTO users (username, email, role, password, created_at, updated_at)
    VALUES ($1, $2, $3, $4, NOW(), NOW())
    RETURNING id, username, email, role;
  `;

  try {
    const result = await client.query(query, [username, email, role, hashedPassword]);
    return result.rows[0];
  } catch (error: any) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};


export const getUserByEmailRepo = async (email: string) => {
  const query = `SELECT * FROM users WHERE email = $1;`;
  try {
    const result = await client.query(query, [email]);
    return result.rows[0];
  } catch (error: any) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};
