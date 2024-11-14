import redis from 'redis';

const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` || 'redis://localhost:6379';
const RedisClient = redis.createClient({ url });

RedisClient.connect();

RedisClient.on('connect', () => {
	// eslint-disable-next-line no-console
	console.log(`Redis is all ears on port ${process.env.REDIS_PORT}`);
});

export default RedisClient;
