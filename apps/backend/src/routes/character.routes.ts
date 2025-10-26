import { Router } from 'express';
import { CharacterController } from '../controllers/character.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const characterController = new CharacterController();

// All character routes require authentication
router.use(authMiddleware);

router.post('/generate', characterController.generateCharacter);
router.get('/', characterController.getCharacters);
router.get('/:id', characterController.getCharacter);
router.delete('/:id', characterController.deleteCharacter);

export const characterRoutes = router;

