import { Schema, model, Types } from "mongoose";
import { IDocumentSource } from "../interfaces/interface.document.source";

const documentSource = new Schema({
    repoType: {
        type: String,
        enum: ["DevOps", "GitHub"],
        required: true
    },
    personalAccessToken: {
        type: String,
        required: true
    },
    enterprise:{
        type:Types.ObjectId,
        ref:"Enterprise",
        required:true
    }
}, { timestamps: true })

export const DocumentSource = model<IDocumentSource>("DocumentSource", documentSource);