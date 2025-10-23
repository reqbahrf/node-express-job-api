import { Request, Response, NextFunction } from 'express';
import { UnauthenticatedError } from '../../errors/index.js';
const applicant = (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role;
  if (role !== 'applicant') {
    throw new UnauthenticatedError('Authentication invalid');
  }
  next();
};

export default applicant;
