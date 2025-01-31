import { Schema, Types, model } from "mongoose";
import { IMarketingAgentApiKeys } from "../interfaces/interface.api.keys";

const marketingAgentApiKeys = new Schema({
    firecrawlKey: {
        type: String,
        required: true
    },
    serperKey: {
        type: String,
        required: true
    },
    enterprise: {
        type: Types.ObjectId,
        required: true
    }
}, { timestamps: true })

export const MarketingAgentKeys = model<IMarketingAgentApiKeys>("MarketingAgentKeys", marketingAgentApiKeys);