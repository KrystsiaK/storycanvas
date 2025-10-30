import { Router } from 'express';
import { CharacterController } from '../controllers/character.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { characterValidators } from '../validators/character.validator';

const router = Router();
const characterController = new CharacterController();

// All character routes require authentication
router.use(authMiddleware);

router.post('/generate', validate(characterValidators.generateCharacter), characterController.generateCharacter);
router.get('/', characterController.getCharacters);
router.get('/:id', validate(characterValidators.characterId, 'params'), characterController.getCharacter);
router.delete('/:id', validate(characterValidators.characterId, 'params'), characterController.deleteCharacter);

export const characterRoutes = router;

