import { Request, Response, NextFunction } from 'express';
import { sendApiResponse, STATUS_CODES, responseMessage } from '../common';
import { logger } from '../utils/logger';

/**
 * Global Error Handler Middleware
 * Handles all errors and returns consistent error responses
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error({
        message: 'Error occurred',
        error: err,
        url: req.originalUrl,
        method: req.method
    });

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e: any) => e.message);
        return sendApiResponse(
            res,
            STATUS_CODES.BAD_REQUEST,
            'Validation Error',
            {},
            { errors }
        );
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return sendApiResponse(
            res,
            STATUS_CODES.CONFLICT,
            responseMessage.dataAlreadyExist(field),
            {}
        );
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return sendApiResponse(
            res,
            STATUS_CODES.UNAUTHORIZED,
            responseMessage.invalidToken,
            {}
        );
    }

    if (err.name === 'TokenExpiredError') {
        return sendApiResponse(
            res,
            STATUS_CODES.UNAUTHORIZED,
            responseMessage.tokenExpire,
            {}
        );
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        return sendApiResponse(
            res,
            STATUS_CODES.BAD_REQUEST,
            'Invalid ID format',
            {}
        );
    }

    // Custom application error
    if (err.statusCode) {
        return sendApiResponse(
            res,
            err.statusCode,
            err.message || responseMessage.internalServerError,
            {},
            process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}
        );
    }

    // Default server error
    return sendApiResponse(
        res,
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        responseMessage.internalServerError,
        {},
        process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}
    );
};

/**
 * 404 Not Found Handler
 * Handles undefined routes
 */
export const notFoundHandler = (req: Request, res: Response) => {
    return sendApiResponse(
        res,
        STATUS_CODES.NOT_FOUND,
        `Route ${req.originalUrl} not found`,
        {}
    );
};
