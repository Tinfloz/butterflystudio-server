import { Schema, Types, model } from "mongoose";
import { IDocIntegration } from "../interfaces/interface.document.source";
import { DOC_INTEGRATIONS } from "../utils/utils.consts";

const docIntegration = new Schema<IDocIntegration>({
    docSource: {
        type: Types.ObjectId,
        ref: "DocumentSource",
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    repo: {
        type: String,
        required: true
    },
    docSourceType: {
        type: String,
        enum: DOC_INTEGRATIONS,
        required: true
    },
    user: {
        type: String,
        required: function (): boolean {
            return this.docSourceType === "GitHub"
        }
    },
    org: {
        type: String,
        required: function (): boolean {
            return this.docSourceType === "DevOps"
        }
    },
    project: {
        type: String,
        required: function (): boolean {
            return this.docSourceType === "DevOps"
        }
    },
    enterprise: {
        type: String,
        required: true
    }
}, { timestamps: true })

export const DocIntegration = model<IDocIntegration>("DocIntegration", docIntegration)