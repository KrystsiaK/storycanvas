import { Router } from 'express';
import { CharacterController } from '../controllers/character.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { CreateCharacterSchema, CharacterIdSchema } from '../validators/character.validator';

const router = Router();
const characterController = new CharacterController();

// All character routes require authentication
router.use(authMiddleware);

router.post('/generate', validate(CreateCharacterSchema, 'body'), characterController.generateCharacter);
router.get('/', characterController.getCharacters);
router.get('/:id', validate(CharacterIdSchema, 'params'), characterController.getCharacter);
router.delete('/:id', validate(CharacterIdSchema, 'params'), characterController.deleteCharacter);

export const characterRoutes = router;

