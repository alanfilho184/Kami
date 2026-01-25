import { Request, Response, NextFunction } from 'express';

export default function bodyParser(req: Request, res: Response, next: NextFunction) {
    req.rawBody = req.body.toString();
    try {
        req.body = JSON.parse(req.body.toString());
    } catch (err) {
        req.body = {};
    }
    next();
}
