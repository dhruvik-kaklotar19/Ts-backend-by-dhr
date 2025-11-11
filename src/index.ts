"use strict";

import express, { Request, Response } from 'express';
require('dotenv').config();
import * as bodyParser from 'body-parser';
import http from 'http';
import cors from 'cors';
import * as packageInfo from '../package.json';

import { mongooseConnection } from './database';
import { router } from './routes';
import { morganLogger } from './middleware';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
app.use(morganLogger);

// Database connection
mongooseConnection();

// Health check routes
app.get('/', healthCheck);
app.get('/health', healthCheck);

// API routes
app.use('/api', router);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Health check handler
function healthCheck(req: Request, res: Response) {
    return res.status(200).json({
        status: 'success',
        message: "Ts-server Server is Running",
        app: packageInfo.name,
        version: packageInfo.version,
        description: packageInfo.description,
        author: packageInfo.author,
        license: packageInfo.license,
        timestamp: new Date().toISOString()
    });
}

const server = new http.Server(app);
export default server;
