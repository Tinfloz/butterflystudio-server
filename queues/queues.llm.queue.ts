import { Queue } from "bullmq";
import { redisClient } from "../config/config.redis";
import { DEFAULT_QUEUE_OPTIONS } from "../utils/utils.consts";

export const llmQueue = new Queue('llmQueue', {
    connection: redisClient,
    defaultJobOptions: {
        ...DEFAULT_QUEUE_OPTIONS,
        delay: 15 * 60 * 1000
    },
})

llmQueue.on('error', (err) => {
    console.error('Queue error:', err);
});

llmQueue.on('waiting', (jobId) => {
    console.log('Job waiting:', jobId);
});