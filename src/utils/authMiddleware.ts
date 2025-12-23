// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";

// const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

// // Extend Express Request to include `user`
// export interface AuthRequest extends Request {
//   user?: {
//     id: string;
//     username: string;
//     email: string;
//   };
// }

// // Middleware to verify token and attach user info
// export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1]; // Bearer <token>

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as any;
//     req.user = {
//       id: decoded.id,
//       username: decoded.username,
//       email: decoded.email,
//     };
//     next(); // continue to next middleware or route
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid or expired token" });
//   }
// };


import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    req.user = {
      id: decoded.id,
    };

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};