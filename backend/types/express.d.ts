import { Request } from 'express';

interface UserPayload {
  userId: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
