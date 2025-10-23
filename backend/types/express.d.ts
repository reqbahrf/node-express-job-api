export interface UserPayload {
  userId: string;
  username: string;
  role: string;
  /* eslint-disable  no-unused-vars */
  isOwner: (id: string) => boolean;
  isAllowedToAccess: (allowedRoles: string[]) => boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
