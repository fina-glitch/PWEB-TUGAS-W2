import { AuthResponse } from './auth';

declare global {
  namespace Express {
    interface Request {
      user?: AuthResponse;
      requestId?: string;
    }
  }
}