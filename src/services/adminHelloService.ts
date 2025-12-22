import { Request, Response } from 'express';

export const getHelloService = async (req: Request, res: Response) => {
  console.log("getHelloService called"); 
  return res.status(200).json({ message: "Hello World from kajal!" });
};
