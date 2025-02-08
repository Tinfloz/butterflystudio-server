import { Queue } from "bullmq";
import { redisClient } from "../config/config.redis";
import { DEFAULT_QUEUE_OPTIONS } from "../utils/utils.consts";

export const slackQueue = new Queue('slackQueue', {
    connection: redisClient,
    defaultJobOptions: {
        ...DEFAULT_QUEUE_OPTIONS
    },
});

slackQueue.on('error', (err) => {
    console.error('Queue error:', err);
});

slackQueue.on('waiting', (jobId) => {
    console.log('Job waiting:', jobId);
});