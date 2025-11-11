import mongoose from 'mongoose';
import { logger } from '../../utils/logger';

mongoose.set('strictQuery', true);

/**
 * Connect to MongoDB
 */
export const mongooseConnection = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.DB_URL || '');
        logger.info(`✅ Database connected: ${process.env.DB_URL}`);
    } catch (err) {
        logger.error({ message: '❌ Database connection error', error: err });
        process.exit(1);
    }
};