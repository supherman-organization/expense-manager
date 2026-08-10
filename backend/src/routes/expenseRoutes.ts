import { Router } from 'express';
import {
  createExpense,
  getMyExpenses,
  getExpenseById,
} from '../controllers/expenseController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { upload } from '../middlewares/upload';
import { createExpenseSchema } from '../validators/expenseValidators';

const router = Router();

router.get('/me', authenticate, getMyExpenses);
router.post(
  '/',
  authenticate,
  upload.array('attachments', 5),
  validate(createExpenseSchema),
  createExpense,
);
router.get('/:id', authenticate, getExpenseById);

export default router;