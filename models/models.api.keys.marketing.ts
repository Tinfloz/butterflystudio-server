import { Schema, Types, model } from "mongoose";
import { IMarketingAgentApiKeys } from "../interfaces/interface.api.keys";

const scraperApiKeys = new Schema({
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
        ref:"Enterprise",
        required: true
    }
}, { timestamps: true })

export const ScraperApiKeys = model<IMarketingAgentApiKeys>("ScraperApiKeys", scraperApiKeys);