import { createClient } from 'redis';

const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` || 'redis://localhost:6379';
const RedisClient = createClient({ url });

RedisClient.connect().catch((err) => {
	console.error('Redis connection error:', err);
});

RedisClient.on('connect', () => {
	console.log(`Redis is all ears on port ${process.env.REDIS_PORT}`);
});

export default RedisClient;
