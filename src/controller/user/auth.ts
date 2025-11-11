import { Request, Response, NextFunction } from 'express';
import { sendApiResponse, STATUS_CODES } from '../../common';

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    return sendApiResponse(res, STATUS_CODES.NOT_IMPLEMENTED, 'User login not implemented', {});
};

export const userSignUp = async (req: Request, res: Response, next: NextFunction) => {
    return sendApiResponse(res, STATUS_CODES.NOT_IMPLEMENTED, 'User signup not implemented', {});
};
