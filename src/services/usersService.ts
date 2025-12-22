import {Request, Response} from "express";
import { createUserRepo, deleteUserRepo, getUserByIdRepo, updateUserRepo } from "../repositories/usersRepo";
import { client } from "../utils/pg";


//get users data

export const getAllUsers = async (req: Request, res: Response) => {
  try{
    const result = await client.query("SELECT * FROM users");
    res.json(result.rows);
  } catch(error: any) {
    res.status(500).json({ message : `Error fetching users: ${error.message}`});
  }
}

// Create new project
export const createUsers = async (req: Request, res: Response) => {
  const { username, email, password, projects, role, added_by } = req.body; 

  if (!username) {
    return res.status(400).json({ error: "username is required" });
  }

  try {
    
    // const data = { ...req.body };
    const result = await createUserRepo({
        username,
        password,
        email,
        projects,
        role,
        added_by
      });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: `Error createProjects: ${error.message}` });
  }
};



// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await getUserByIdRepo(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: `Error fetching user: ${error.message}` });
  }
};


// Update user
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedUser = await updateUserRepo(id, data);
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating user: ${error.message}` });
  }
};


// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedUser = await deleteUserRepo(id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error: any) {
    res.status(500).json({ message: `Error deleting user: ${error.message}` });
  }
};
