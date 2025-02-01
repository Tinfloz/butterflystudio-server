import { Document, Schema } from "mongoose";

export interface IDocumentSource extends Document {
    repoType: "DevOps" | "GitHub",
    personalAccessToken: string,
    enterprise:Schema.Types.ObjectId
}

export interface IDocIntegration extends Document {
    docSource: Schema.Types.ObjectId;
    branch: string;
    repo: string;
    docSourceType: "DevOps" | "GitHub";
    user?: string;
    org?:string;
    project?:string,
    enterprise:Schema.Types.ObjectId
}
