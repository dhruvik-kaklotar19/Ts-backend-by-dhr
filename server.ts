import dotenv from 'dotenv';
dotenv.config();
import { validateEnv } from './src/utils/envValidator';
import { logger } from './src/utils/logger';
import server from './src';

// Validate environment variables before start ing
validateEnv();

const port = process.env.PORT || 8082;
server.listen(port, () => {
    logger.info(`🚀 Server started on port ${port}`);
    logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});