import { z } from 'zod';

export const createUserSchema = z.object({
    email: z.string().email(),
    role: z.enum(['employee', 'manager', 'accounting']),
    
});