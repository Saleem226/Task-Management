import { UserPayload } from '../auth/auth.interfaces';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export interface CustomRequest extends Request {
  user: UserPayload;
}
