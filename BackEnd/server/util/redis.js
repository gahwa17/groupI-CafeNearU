const redis = require('redis');
const redisClient = redis.createClient();

module.exports = {
  setCache: async (cacheKey, value, expiretime) => {
    try {
      await redisClient.connect();
      await redisClient.set(cacheKey, value, {
        EX: expiretime,
      });
    } catch (error) {
      console.error('Redis error:', error);
    } finally {
      await redisClient.disconnect();
    }
  },
  delCache: async (cacheKey) => {
    try {
      await redisClient.connect();
      await redisClient.del(cacheKey);
    } catch (error) {
      console.error('Redis error:', error);
    } finally {
      await redisClient.disconnect();
    }
  },
  getCache: async (cacheKey) => {
    try {
      await redisClient.connect();
      const result = await redisClient.get(cacheKey);
      return result;
    } catch (error) {
      console.error('Redis error:', error);
    } finally {
      await redisClient.disconnect();
    }
  },
  existsCache: async (cacheKey) => {
    try {
      await redisClient.connect();
      const exists = await redisClient.exists(cacheKey);
      return exists === 1;
    } catch (error) {
      console.error('Redis error:', error);
    } finally {
      await redisClient.disconnect();
    }
  },
};
