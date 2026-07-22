import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { generateContentStream } from '../services/openRouterService';
import ContentHistory from '../models/ContentHistory';

export const handleGenerate = async (req: AuthRequest, res: Response) => {
  try {
    const { prompt, tool, language, tone, finalPrompt } = req.body;
    await generateContentStream({ prompt, tool, language, tone, finalPrompt }, res);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const saveHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { prompt, response, toolUsed, language, tone } = req.body;
    
    const history = new ContentHistory({
      user: req.user?.id,
      prompt,
      response,
      toolUsed,
      language,
      tone
    });

    await history.save();
    res.status(201).json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save history' });
  }
};
