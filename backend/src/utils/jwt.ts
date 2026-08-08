import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';

export interface JwtPayload {
    id: string;
    role: UserRole;
}

function getSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET manquant.');
    return secret;
}
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: '1d' });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, getSecret()) as JwtPayload;
}