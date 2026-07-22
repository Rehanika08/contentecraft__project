import { Router } from 'express';
import { getHistory, deleteHistory } from '../controllers/historyController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);
router.get('/', getHistory);
router.delete('/:id', deleteHistory);

export default router;
