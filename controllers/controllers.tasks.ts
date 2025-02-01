import { Request, Response } from "express";
import { slackQueue } from "../queues/queues.slack.push";
import { randomUUID } from "crypto";

export const configureTasks = async (req: Request, res: Response) => {
    const { channelId, oauth, message } = req.body;
    try {
        const jobName = `sendMessage-${randomUUID()}`;     
        const job = await slackQueue.add(
            jobName,
            {
                channelId,
                oauth,
                message,
                timestamp: new Date().toISOString()
            },
            {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
                repeat: {
                    pattern: "* * * * *",
                    immediately: true
                },
                jobId: jobName,
                removeOnComplete: {
                    age: 3600,
                    count: 1000
                },
                removeOnFail: {
                    age: 24 * 3600
                }
            }
        );

        console.log('Job added to queue:', {
            id: job.id,
            name: job.name,
            timestamp: new Date().toISOString()
        });
        
        res.status(200).json({
            message: "Message scheduled successfully",
            jobId: job.id,
            name: job.name
        });
    } catch (error:any) {
        console.error('Error adding job to queue:', error);
        res.status(500).json({
            message: "Failed to schedule message",
            error: error.message
        });
    }
};

// Add a utility function to get queue status
export const getQueueStatus = async (_req: Request, res: Response) => {
    try {
        const jobs = await slackQueue.getJobs(['waiting', 'active', 'completed', 'failed']);
        const counts = {
            waiting: await slackQueue.getWaitingCount(),
            active: await slackQueue.getActiveCount(),
            completed: await slackQueue.getCompletedCount(),
            failed: await slackQueue.getFailedCount(),
        };
        
        res.status(200).json({
            counts,
            jobs: jobs.map(job => ({
                id: job.id,
                name: job.name,
                state: job.state,
                data: job.data,
                timestamp: job.timestamp
            }))
        });
    } catch (error:any) {
        res.status(500).json({
            message: "Failed to get queue status",
            error: error.message
        });
    }
};