import AuthService from "@src/services/auth";
import { NextFunction, Request, Response } from "express";

// Partial faz com que todos os campos do Request sejam opicionais
export function authMiddleware(req: Partial<Request>, res: Partial<Response>, next: NextFunction): void {
    const token = req.headers?.['x-access-token']; // ?. -> Check

    try {
        const decoded = AuthService.decodeToken(token as string);

        req.decoded = decoded;
        next();
    } catch (err) {
        let errorMessage = 'Falha na autenticação';

        if (err instanceof Error) {
            errorMessage = err.message;
        }
        else if (typeof err === 'string') {
            errorMessage = err;
        }

        res.status?.(401).send({ code: 401, error: errorMessage });
    }
}