import { Request, Router, Response, NextFunction } from 'express';
import { userStatus } from '../common';
import { adminRoutes } from './admin';
import { uploadRoutes } from './upload';
import { userRoutes } from './user';

const router = Router();

/**
 * Access Control Middleware
 * Sets userType based on URL path
 */

const accessControl = (req: Request, res: Response, next: any) => {
    req.headers.userType = userStatus[req.originalUrl.split('/')[1]]
    next()
}

router.use('/admin', accessControl, adminRoutes);
router.use('/user', accessControl, userRoutes);
router.use('/upload', accessControl, uploadRoutes);

export { router };   