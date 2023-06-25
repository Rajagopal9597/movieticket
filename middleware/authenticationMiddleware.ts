
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (token !== process.env.TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
};

