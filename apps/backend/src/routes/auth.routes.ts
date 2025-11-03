import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { RegisterSchema, LoginSchema, RefreshTokenSchema } from '../validators/auth.validator';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(RegisterSchema, 'body'), authController.register);
router.post('/login', validate(LoginSchema, 'body'), authController.login);
router.post('/refresh', validate(RefreshTokenSchema, 'body'), authController.refreshToken);
router.post('/logout', authController.logout);

export const authRoutes = router;

