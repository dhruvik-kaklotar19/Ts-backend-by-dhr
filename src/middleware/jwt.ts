import jwt from 'jsonwebtoken';
import config from 'config';
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { userModel } from '../database/model';
import { userStatus, sendApiResponse, STATUS_CODES, responseMessage } from '../common';
import { logger } from '../utils/logger';

const ObjectId = mongoose.Types.ObjectId;
const jwt_token_secret = config.get('jwt_token_secret') as string;

export const adminJWT = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return sendApiResponse(res, STATUS_CODES.UNAUTHORIZED, responseMessage.tokenNotFound, null);
    }

    try {
        const isVerifyToken: any = jwt.verify(authorization, jwt_token_secret);
        const result: any = await userModel.findOne({
            _id: new ObjectId(isVerifyToken._id),
            userType: userStatus.admin,
            isActive: true
        });

        if (result?.isActive === true) {
            req.headers.user = result;
            return next();
        }

        return sendApiResponse(res, STATUS_CODES.UNAUTHORIZED, responseMessage.invalidToken, {});
    } catch (err: any) {
        if (err.message === 'invalid signature') {
            return sendApiResponse(res, STATUS_CODES.FORBIDDEN, responseMessage.differentToken, {});
        }
        logger.error({ message: 'JWT verification error', error: err });
        return sendApiResponse(res, STATUS_CODES.UNAUTHORIZED, responseMessage.invalidToken, {});
    }
};

export const userJWT = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return sendApiResponse(res, STATUS_CODES.UNAUTHORIZED, responseMessage.tokenNotFound, null);
    }

    try {
        const isVerifyToken: any = jwt.verify(authorization, jwt_token_secret);
        const result: any = await userModel.findOne({
            _id: new ObjectId(isVerifyToken._id),
            isActive: true
        });

        if (result?.isActive === true) {
            req.headers.user = result;
            return next();
        }

        return sendApiResponse(res, STATUS_CODES.UNAUTHORIZED, responseMessage.invalidToken, {});
    } catch (err: any) {
        if (err.message === 'invalid signature') {
            return sendApiResponse(res, STATUS_CODES.FORBIDDEN, responseMessage.differentToken, {});
        }
        logger.error({ message: 'JWT verification error', error: err });
        return sendApiResponse(res, STATUS_CODES.UNAUTHORIZED, responseMessage.invalidToken, {});
    }
};
