import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';
import { PDFService } from '../services/pdf.service';

export class PDFController {
  private pdfService = new PDFService();

  async downloadStoryPDF(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const story = await prisma.story.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!story) {
        return res.status(404).json({ error: 'Story not found' });
      }

      const pdfBuffer = await this.pdfService.generateStoryPDF(story);

      // Set headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${story.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);

      res.send(pdfBuffer);
    } catch (error) {
      logger.error('Download story PDF error:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  }

  async downloadAllStoriesPDF(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      const stories = await prisma.story.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      if (stories.length === 0) {
        return res.status(404).json({ error: 'No stories found' });
      }

      const pdfBuffer = await this.pdfService.generateMultipleStoriesPDF(stories);

      // Set headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="My_Story_Collection.pdf"');
      res.setHeader('Content-Length', pdfBuffer.length);

      res.send(pdfBuffer);
    } catch (error) {
      logger.error('Download all stories PDF error:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  }
}

