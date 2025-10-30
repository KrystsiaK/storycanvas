import { Router } from 'express';
import { PDFController } from '../controllers/pdf.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { storyValidators } from '../validators/story.validator';

const router = Router();
const pdfController = new PDFController();

// All PDF routes require authentication
router.use(authMiddleware);

router.get('/story/:id', validate(storyValidators.storyId, 'params'), pdfController.downloadStoryPDF);
router.get('/collection', pdfController.downloadAllStoriesPDF);

export const pdfRoutes = router;

