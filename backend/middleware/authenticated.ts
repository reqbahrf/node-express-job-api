import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors/index.js';
import { Request, Response, NextFunction } from 'express';
import { UserPayload } from '../types/express.js';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const secret = process.env.JWT_ACCESS_SECRET as string;
  const token = req.headers.authorization;
  if (!token || !token.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid');
  }
  const jwtToken = token.split('Bearer ')[1];
  try {
    const decode = jwt.verify(jwtToken, secret) as UserPayload;
    req.user = { userId: decode.userId, username: decode.username };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};

export default auth;
