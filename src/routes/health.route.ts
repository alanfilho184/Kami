import { Router, Request, Response } from 'express';

const router = Router();

router.get('/ping', (req: Request, res: Response) => {
    res.status(200).json({ pong: true, timestamp: Date.now() });
});

export default router;
