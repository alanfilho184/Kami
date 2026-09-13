import { Router } from 'express';
import interactions from './interactions.route';

const router = Router();

router.use(interactions);

export default router;
