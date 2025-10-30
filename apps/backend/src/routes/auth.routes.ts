import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { authValidators } from '../validators/auth.validator';
import { authLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();
const authController = new AuthController();

router.post('/register', authLimiter, validate(authValidators.register), authController.register);
router.post('/login', authLimiter, validate(authValidators.login), authController.login);
router.post('/refresh', validate(authValidators.refreshToken), authController.refreshToken);
router.post('/logout', authController.logout);

export const authRoutes = router;

