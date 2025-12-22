import {Router} from "express";
import { asyncMiddleware } from "../utils/errorHandling";
import { createProjects, deleteprojects, getProjectsList, updateprojects } from "../services/projectsService";


export const adminProjectsRouter = Router();
//asyncMiddleware is a helper function to handle errors 
//createProjects - is a service function that contains a login to create a project
adminProjectsRouter.post("/", asyncMiddleware(createProjects));

adminProjectsRouter.get("/", asyncMiddleware(getProjectsList));  //getProjectList is a function that actually fetches the projects from the database.

//update a project by ID
adminProjectsRouter.put("/:id" , asyncMiddleware(updateprojects));
// adminProjectsRouter.put("/:id", asyncMiddleware(updateprojects))s


adminProjectsRouter.delete("/:id", asyncMiddleware(deleteprojects));
