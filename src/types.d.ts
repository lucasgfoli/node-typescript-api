import * as http from 'http';
import { decodedUser } from './services/auth';

declare module 'express-serve-static-core' {
    export interface Request extends http.IncomingMessage, Express.Request {
        decoded?: decodedUser;
    }
}