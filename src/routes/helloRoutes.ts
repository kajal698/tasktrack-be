import { Router } from 'express';
import { asyncMiddleware } from '../utils/errorHandling';
import { getHelloService } from '../services/adminHelloService';

export const userHelloRouter = Router();

// Using asyncMiddleware so errors are handled
userHelloRouter.get("/", asyncMiddleware(getHelloService));


// export const userHelloRouter = Router();

// userHelloRouter.get("/", (req: Request, res: Response) => {
//   res.status(200).json({ message: "Hello World!" });
// });
