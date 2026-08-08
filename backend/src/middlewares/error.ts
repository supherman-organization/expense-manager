import { Request, Response, NextFunction} from 'express';

export class AppError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message });
}
console.error('Erreur inattendue:', err);
return res.status(500).json({ message: 'Erreur interne du serveur.' });
}