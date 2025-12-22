// server.ts (or index.ts)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";   //Used to load environment variables from a .env file into process.env
import { userHelloRouter } from "./src/routes/helloRoutes";
import { adminProjectsRouter } from "./src/routes/adminProjects";
import { adminUserRouter } from "./src/routes/adminUsers";
import { adminCommentsRouter } from "./src/routes/comments";
import { adminTasksRouter } from "./src/routes/adminTasks";
import { authRouter } from "./src/routes/authRoutes";
import helmet from "helmet";
import morgan from "morgan";
import { notificationRouter } from "./src/routes/notification";
import { adminReportRouter } from "./src/routes/adminReports";

//express is Node.js web framework you’re using to handle routes and APIs
//a middleware that allows your backend to be accessed from other origins
dotenv.config();

const app = express();
app.use(cors());   //CORS = Cross-Origin Resource Sharing
//It’s a browser rule that decides whether a web page from one origin (like your frontend) can access another origin (like your backend).

app.use(helmet());   //used for server security.
app.use(express.json());
app.use(morgan("dev"));

 
//for projects  - post
app.use("/a/projects", adminProjectsRouter)

//for users
app.use("/a/users", adminUserRouter)


app.use("/a/reports", adminReportRouter) 
//for tasks
app.use("/a/tasks", adminTasksRouter)

//for comments
app.use("/u/comments", adminCommentsRouter)

//for auth - register or login 
app.use("/auth", authRouter);

// Mount/matches the router
app.use("/a/hello", userHelloRouter); 

app.use("/a/notifications", notificationRouter);




const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
 