import { Request, Response, NextFunction } from 'express';
import AuthService from '@src/services/auth';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers['x-access-token'] as string;

  if (!token) {
    res.status(401).send({ code: 401, error: 'Token não informado' });
    return;
  }

  try {
    const decoded = AuthService.decodeToken(token);
    (req as any).decoded = decoded;
    next();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Falha na autenticação';
    res.status(401).send({ code: 401, error: message });
  }
}
