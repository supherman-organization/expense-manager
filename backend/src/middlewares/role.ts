import { Request, Response, NextFunction} from 'express';
import { UserRole } from '../models/User';
import { AppError } from './error';

export function authorize(roles: UserRole[]) {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError(401, 'Utilisateur non authentifié.');
        }
        if (!roles.includes(req.user.role)) {
            throw new AppError(403, 'Accès refusé. Rôle insuffisant.');
    }
    next();
   };
}