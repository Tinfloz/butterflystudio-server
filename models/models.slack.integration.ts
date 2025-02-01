import { Schema, model, Types } from "mongoose";
import { ISlackIntegration } from "../interfaces/interface.slack";

const slackSchema = new Schema({
    channelId: {
        type: String,
        required: true,
    },
    slackOAuth: {
        type: String,
        required: true
    },
    enterprise: {
        type: Types.ObjectId,
        ref: "Enterprise",
        required: true
    }
}, { timestamps: true })

export const SlackIntegration = model<ISlackIntegration>("SlackIntegration", slackSchema);