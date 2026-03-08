import type { Request, Response, NextFunction } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const TryCatch = (handler: AsyncHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res, next);
        } catch (error:any) {
            res.status(500).json({
                message:error.message
            })
            next(error);
        }
    };
};