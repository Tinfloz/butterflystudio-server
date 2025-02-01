import { Document } from "mongoose";

export interface ISlackIntegration extends Document {
    channelId:string;
    slackOAuth:string;
}