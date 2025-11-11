import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import { sendApiResponse, STATUS_CODES } from '../common/responce';

export interface SchemaConfig {
    body?: Joi.ObjectSchema;
    query?: Joi.ObjectSchema;
    params?: Joi.ObjectSchema;
    headers?: Joi.ObjectSchema;
}

export const validate = (schemas: SchemaConfig) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (schemas.body) {
                req.body = await schemas.body.validateAsync(req.body, {
                    abortEarly: true,
                    allowUnknown: false,
                    stripUnknown: false,
                });
            }

            if (schemas.query) {
                req.query = await schemas.query.validateAsync(req.query, {
                    abortEarly: true,
                    allowUnknown: false,
                    stripUnknown: false,
                }) as any;
            }

            if (schemas.params) {
                req.params = await schemas.params.validateAsync(req.params, {
                    abortEarly: true,
                    allowUnknown: false,
                    stripUnknown: false,
                }) as any;
            }

            if (schemas.headers) {
                req.headers = await schemas.headers.validateAsync(req.headers, {
                    abortEarly: true,
                    allowUnknown: true,
                }) as any;
            }

            next();
        } catch (error: any) {
            const cleanMessage = (error?.message || 'Validation error').replace(/["']/g, '');
            return sendApiResponse(res, STATUS_CODES.BAD_REQUEST, cleanMessage, {});
        }
    };
};


