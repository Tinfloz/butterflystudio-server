import { Document, Schema } from "mongoose";

export interface IEnterprise extends Document {
    _id: Schema.Types.ObjectId,
    name: string,
    createdBy: Schema.Types.ObjectId,
    status: boolean
}

export interface IConfigureEnterprise {
    enterprise: string
}

export interface IMarketingAgentConfig {
    firecrawlKey: string,
    serperKey: string
}