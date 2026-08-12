import { z } from 'zod';

export const createUserSchema = z.object({
    email: z.string().email(),
    role: z.enum(['employee', 'manager', 'accounting']),
    firstName: z.string().min(1, 'Le prénom est requis'),
    lastName: z.string().min(1, 'Le nom est requis'),   
});