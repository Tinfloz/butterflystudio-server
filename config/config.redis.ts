import Redis from "ioredis";

export const redisClient = new Redis({
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    tls: {},
    connectTimeout: 10000,
    maxRetriesPerRequest: null
});