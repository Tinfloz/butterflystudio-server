import { Schema } from "mongoose";
import { IMarketingAgentConfig } from "./interface.enterprise";

export interface IMarketingAgentApiKeys extends IMarketingAgentConfig {
    enterprise: Schema.Types.ObjectId
} 