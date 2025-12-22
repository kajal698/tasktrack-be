import { Request, Response } from "express";
import { createProjectsRepo, deleteprojectsRepo, getProjectsListRepo, updateprojectsRepo } from "../repositories/projectsRepo";

// Create new project
export const createProjects = async (req: Request, res: Response) => {
  const { name, added_by} = req.body;//req.body contains data sent by the client(fronted) (via post request)

  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }

  try {
    
    // const data = { ...req.body };
    const result = await createProjectsRepo({
        name,
        added_by
      });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: `Error createProjects: ${error.message}` });
  }
};


//get project - it only reads the data

export const getProjectsList = async (req: Request, res: Response) => { //the req -from the client and res - the response we send back to the client
    try {
        const projects = await getProjectsListRepo();  //calls the repos function that queries the database from all projects
        res.json({data: projects}); // sends the projects back to the client in JSON format
        //{data: projects}  - is a common paatern to wrap data in a key called data
    } catch (error: any) {
        throw new Error(`Error fetching projects: ${error.message}`);
    }
};



// Update project
export const updateprojects = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;


  // 1) basic validation
  if(!id) return res.status(400).json({ error: "id is required in path" });
  if(!name) return res.status(400).json({ error: "name is required" });

  try{
    //2) call a repo to update 
    const updated = await updateprojectsRepo(id, { name });

   //3) if repo didn't find the record, return 404
    if(!updated) return res.status(404).json({ error: "Project not found" });

   //4) sucees: return updated resource
   return res.json({ data: updated });
  } catch (error: any) {
    return res.status(500).json({error: `Error updating project : ${error.message}` });
  }
}

//delete a proejct
export const deleteprojects = async (req: Request, res: Response) => {
  const { id } = req.params;

  // validation
  if (!id) {
    return res.status(400).json({ error: "id is required in path" });
  }

  try {
    const deleted = await deleteprojectsRepo(id);

    if (!deleted) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.json({
      message: "Project deleted successfully",
      data: deleted,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: `Error deleting project: ${error.message}`,
    });
  }
};