import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { profileValidators } from '../validators/profile.validator';

const router = Router();
const profileController = new ProfileController();

// All profile routes require authentication
router.use(authMiddleware);

router.get('/', profileController.getProfile);
router.patch('/', validate(profileValidators.updateProfile), profileController.updateProfile);
router.delete('/', validate(profileValidators.deleteAccount), profileController.deleteAccount);

export const profileRoutes = router;

