import { Queue } from "bullmq";
import { redisClient } from "../config/config.redis";

export const scraperQueue = new Queue('scraperQueue', {
    connection: redisClient,
    defaultJobOptions: {
        removeOnComplete: {
            age: 3600,
            count: 1000
        },
        removeOnFail: {
            age: 24 * 3600
        },
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
    },
})

scraperQueue.on('error', (err) => {
    console.error('Queue error:', err);
});

scraperQueue.on('waiting', (jobId) => {
    console.log('Job waiting:', jobId);
});