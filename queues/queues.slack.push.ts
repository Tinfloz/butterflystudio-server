import { Queue } from "bullmq";
import { redisClient } from "../config/config.redis";

export const slackQueue = new Queue('slackQueue', {
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
});

slackQueue.on('error', (err) => {
    console.error('Queue error:', err);
});

slackQueue.on('waiting', (jobId) => {
    console.log('Job waiting:', jobId);
});