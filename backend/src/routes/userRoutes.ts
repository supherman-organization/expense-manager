import { Router } from 'express';
import { createUser } from '../controllers/userController';
import { authenticate } from '../middlewares/auth';
import { authorize } from '../middlewares/role';
import { validate } from '../middlewares/validate';
import { createUserSchema } from '../validators/userValidators';

const router = Router();

router.post('/', authenticate, authorize('manager'), validate(createUserSchema), createUser);

export default router;