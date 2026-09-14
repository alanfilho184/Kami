import { Router } from 'express';
import interactions from './interactions.route';
import health from './health.route';

const router = Router();

router.use('/health', health);
router.use(interactions);

export default router;
