import { Router } from 'express';
import { StoryController } from '../controllers/story.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { GenerateStorySchema, UpdateStorySchema, StoryIdSchema } from '../validators/story.validator';

const router = Router();
const storyController = new StoryController();

// All story routes require authentication
router.use(authMiddleware);

router.post('/generate', validate(GenerateStorySchema, 'body'), storyController.generateStory);
router.get('/', storyController.getStories);
router.get('/:id', validate(StoryIdSchema, 'params'), storyController.getStory);
router.patch('/:id', validate(StoryIdSchema, 'params'), validate(UpdateStorySchema, 'body'), storyController.updateStory);
router.delete('/:id', validate(StoryIdSchema, 'params'), storyController.deleteStory);

export const storyRoutes = router;

