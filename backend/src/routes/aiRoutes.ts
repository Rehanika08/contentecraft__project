import { Router } from 'express';
import { handleGenerate, saveHistory } from '../controllers/aiController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/generate', handleGenerate);
// Dedicated endpoints can also point to handleGenerate with predefined tools
router.post('/blog', handleGenerate);
router.post('/email', handleGenerate);
router.post('/summarize', handleGenerate);
router.post('/rewrite', handleGenerate);
router.post('/social', handleGenerate);
router.post('/grammar', handleGenerate);
router.post('/creative', handleGenerate);

router.post('/save-history', saveHistory);

export default router;
