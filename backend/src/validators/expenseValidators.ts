import { z } from 'zod';

export const createExpenseSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  comment: z.string().optional(),
  amount: z.coerce.number().min(0, 'Le montant doit être positif'),
  category: z.enum(['repas', 'transport', 'hébergement', 'fournitures', 'autres']).optional(),
  expenseDate: z.coerce.date(),
});

export const decisionSchema = z.object({
  decisionComment: z.string().optional(),
});