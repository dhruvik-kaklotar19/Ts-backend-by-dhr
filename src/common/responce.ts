import { Response } from "express";
import { STATUS_CODES } from './statuscode';

//////////////////////////////
// Normal API Response
//////////////////////////////

export const sendApiResponse = (
    res: Response,
    statusCode: number = 200,
    message: string = "",
    data: any = {},
    error: any = {}
) => {
    return res.status(statusCode).json({
        status: statusCode,
        message,
        data,
        error: Object.keys(error).length === 0 ? {} : error,
    });
};

//////////////////////////////
// Paginated API Response
//////////////////////////////

export const sendPaginatedResponse = (
    res: Response,
    statusCode: number = 200,
    message: string = "",
    dataKey: string = "items",
    items: any[] = [],
    pagination: any = {},
    error: any = {}
) => {
    return res.status(statusCode).json({
        status: statusCode,
        message,
        data: {
            [dataKey]: items,
            state: {
                page: pagination.page || 1,
                limit: pagination.limit || 10,
                page_limit: pagination.page_limit || 10,
                total: pagination.total || 0,
            },
        },
        error: Object.keys(error).length === 0 ? {} : error,
    });
};

//////////////////////////////
// Logger Helper (Legacy - use utils/logger instead)
//////////////////////////////

export const LOG = {
    body: (data: any) => {
        console.log(`body--------------->>`, data);
    },
    info: (label: string, data?: any) => {
        console.log(`${label} data--------------->>`, data);
    },
    error: (data: any) => {
        console.log(`error--------------->>`, data);
    },
};

export { STATUS_CODES };
