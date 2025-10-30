import { Router } from 'express';
import { StoryController } from '../controllers/story.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { storyValidators } from '../validators/story.validator';
import { storyGenerationLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();
const storyController = new StoryController();

// All story routes require authentication
router.use(authMiddleware);

router.post('/generate', storyGenerationLimiter, validate(storyValidators.generateStory), storyController.generateStory);
router.get('/', storyController.getStories);
router.get('/:id', validate(storyValidators.storyId, 'params'), storyController.getStory);
router.patch('/:id', validate(storyValidators.storyId, 'params'), validate(storyValidators.updateStory), storyController.updateStory);
router.delete('/:id', validate(storyValidators.storyId, 'params'), storyController.deleteStory);

export const storyRoutes = router;

