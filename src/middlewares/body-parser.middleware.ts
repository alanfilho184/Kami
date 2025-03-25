import { Request, Response, NextFunction } from 'express';
import logger from '../configs/logger';

export default function bodyParser(req: Request, res: Response, next: NextFunction) {
    req.rawBody = req.body.toString();
    try {
        req.body = JSON.parse(req.body.toString());
    } catch (err) {
        logger.logText('WARN', 'Error parsing body');
        logger.logText('ERROR', err);
        req.body = {};
    }
    next();
}
