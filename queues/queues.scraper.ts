import { Queue } from "bullmq";
import { redisClient } from "../config/config.redis";
import { DEFAULT_QUEUE_OPTIONS } from "../utils/utils.consts";

export const scraperQueue = new Queue('scraperQueue', {
    connection: redisClient,
    defaultJobOptions: {
        ...DEFAULT_QUEUE_OPTIONS
    },
})

scraperQueue.on('error', (err) => {
    console.error('Queue error:', err);
});

scraperQueue.on('waiting', (jobId) => {
    console.log('Job waiting:', jobId);
});