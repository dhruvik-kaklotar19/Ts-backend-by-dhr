export const redisClient = {
    connect: async (): Promise<void> => {
        throw new Error('Redis connection not implemented');
    }
};
