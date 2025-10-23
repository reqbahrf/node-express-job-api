import { Request, Response, NextFunction } from 'express';
import { UnauthenticatedError } from '../../errors/index.js';
const employer = (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role;
  if (role !== 'employer') {
    throw new UnauthenticatedError('Authentication invalid');
  }
  next();
};

export default employer;
