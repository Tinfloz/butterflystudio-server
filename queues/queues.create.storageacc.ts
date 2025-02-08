import { Queue } from "bullmq";
import { redisClient } from "../config/config.redis";
import { DEFAULT_QUEUE_OPTIONS } from "../utils/utils.consts";

export const storageAccQueue = new Queue('storageAccQueue', {
    connection: redisClient,
    defaultJobOptions: {
        ...DEFAULT_QUEUE_OPTIONS
    },
})

storageAccQueue.on('error', (err) => {
    console.error('Queue error:', err);
});

storageAccQueue.on('waiting', (jobId) => {
    console.log('Job waiting:', jobId);
});