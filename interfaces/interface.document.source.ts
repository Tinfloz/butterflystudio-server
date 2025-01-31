import { Document, Schema } from "mongoose";

export interface IDocumentSource extends Document {
    repoType: "DevOps" | "GitHub",
    personalAccessToken: string,
    enterprise:Schema.Types.ObjectId
}