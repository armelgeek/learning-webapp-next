import { createClient } from 'redis';

let redis: any;

try {
  if (process.env.CACHE_URL) {
    redis = await createClient({
      url: process.env.CACHE_URL,
    })
      .on('error', (err) => console.log('Redis Client Error', err))
      .connect();
  } else {
    // Mock Redis for development without Redis server
    redis = {
      get: async () => null,
      set: async () => 'OK',
      del: async () => 1,
      exists: async () => 0,
    };
  }
} catch (error) {
  console.log('Redis connection failed, using mock Redis');
  // Mock Redis for development without Redis server
  redis = {
    get: async () => null,
    set: async () => 'OK',
    del: async () => 1,
    exists: async () => 0,
  };
}

export { redis };
