import { Request, Response, NextFunction } from 'express';
import { Task } from '../models/task.model.js';
import { AuthenticatedRequest } from '../auth.middleware.js';

export const getTasksByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const tasks = await Task.find({ userId }).lean();

    res.json(tasks);
    return;
  } catch (err) {
    return next(err);
  }
};
