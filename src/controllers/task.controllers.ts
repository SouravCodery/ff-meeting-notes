import express, { Response } from 'express';
import { Task } from '../models/task.js';
import { AuthenticatedRequest } from '../auth.middleware.js';

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
