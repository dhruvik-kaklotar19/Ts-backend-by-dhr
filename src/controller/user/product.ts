import { Request, Response, NextFunction } from 'express';
import { sendApiResponse, STATUS_CODES } from '../../common';

export const listProducts = async (req: Request, res: Response, next: NextFunction) => {
    return sendApiResponse(res, STATUS_CODES.NOT_IMPLEMENTED, 'Product listing not implemented', {});
};
