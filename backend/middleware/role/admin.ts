import { Request, Response, NextFunction } from 'express';
import { UnauthenticatedError } from '../../errors/index.js';
const admin = (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role;
  if (role !== 'admin') {
    throw new UnauthenticatedError('Unauthorized access');
  }
  next();
};

export default admin;
