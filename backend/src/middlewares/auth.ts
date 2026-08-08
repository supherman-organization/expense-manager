import { Request, Response, NextFunction} from 'express';
import {verifyToken} from '../utils/jwt';
import { AppError } from './error';

export function authenticate(req: Request, _res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        throw new AppError(401, 'Token manquant ou mal formé.');
    }

    const token = header.split(' ')[1];
    try {
        req.user = verifyToken(token);
        next();
    }catch {
        throw new AppError(401, 'Token invalide ou expiré.');
    }
}