import { z } from 'zod';

export const createExpenseSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  comment: z.string().optional(),
});