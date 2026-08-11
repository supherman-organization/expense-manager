import { Router } from 'express';
import { 
    createExpense, 
    getMyExpenses, 
    getExpenseById, 
    getAllExpenses,  
    validateExpense,
   refuseExpense,
   processExpense,} from '../controllers/expenseController';
import { authorize } from '../middlewares/role';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { upload } from '../middlewares/upload';
import { createExpenseSchema } from '../validators/expenseValidators';

const router = Router();

router.get('/me', authenticate, getMyExpenses);
router.get('/', authenticate, authorize('manager', 'accounting'), getAllExpenses);

router.post(
  '/',
  authenticate,
  upload.array('attachments', 5),
  validate(createExpenseSchema),
  createExpense,
);

router.patch('/:id/validate', authenticate, authorize('manager'), validateExpense);
router.patch('/:id/refuse', authenticate, authorize('manager'), refuseExpense);
router.patch('/:id/process', authenticate, authorize('accounting'), processExpense);

router.get('/:id', authenticate, getExpenseById);

export default router;