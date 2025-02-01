import { Schema, model, Types } from "mongoose";
import { IDocumentSource } from "../interfaces/interface.document.source";
import { DOC_INTEGRATIONS } from "../utils/utils.consts";

const documentSource = new Schema({
    repoType: {
        type: String,
        enum: DOC_INTEGRATIONS,
        required: true
    },
    personalAccessToken: {
        type: String,
        required: true,
        unique:true
    },
    enterprise:{
        type:Types.ObjectId,
        ref:"Enterprise",
        required:true
    }
}, { timestamps: true })

export const DocumentSource = model<IDocumentSource>("DocumentSource", documentSource);