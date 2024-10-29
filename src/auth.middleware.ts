import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  userId: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.header('x-user-id');

  if (!userId) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  (req as AuthenticatedRequest).userId = userId;
  next();
};
