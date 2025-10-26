import { Router } from 'express';
import { StoryController } from '../controllers/story.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const storyController = new StoryController();

// All story routes require authentication
router.use(authMiddleware);

router.post('/generate', storyController.generateStory);
router.get('/', storyController.getStories);
router.get('/:id', storyController.getStory);
router.patch('/:id', storyController.updateStory);
router.delete('/:id', storyController.deleteStory);

export const storyRoutes = router;

