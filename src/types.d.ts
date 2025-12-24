import { decodedUser } from '@src/services/auth';

declare global {
  namespace Express {
    interface Request {
      decoded?: decodedUser;
    }
  }
}

export {};
