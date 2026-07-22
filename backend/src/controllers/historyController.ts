import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import ContentHistory from '../models/ContentHistory';

export const getHistory = async (req: AuthRequest, res: Response) => {
  try {
    const history = await ContentHistory.find({ user: req.user?.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const item = await ContentHistory.findOneAndDelete({ _id: id, user: req.user?.id });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'History item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
