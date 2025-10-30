import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { authValidators } from '../validators/auth.validator';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(authValidators.register), authController.register);
router.post('/login', validate(authValidators.login), authController.login);
router.post('/refresh', validate(authValidators.refreshToken), authController.refreshToken);
router.post('/logout', authController.logout);

export const authRoutes = router;

