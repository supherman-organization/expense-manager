import { Router } from 'express';
import{ login, setPassword, me } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { loginSchema, setPasswordSchema } from '../validators/authValidators';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/set-password', validate(setPasswordSchema), setPassword);
router.get('/me', authenticate, me);

export default router;