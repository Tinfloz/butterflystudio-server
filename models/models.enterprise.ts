import { Schema, Types, model } from "mongoose";
import { IEnterprise } from "../interfaces/interface.enterprise";

const enterprise = new Schema({
    name: {
        type: String,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        required: true,
        ref: "Users"
    }
}, { timestamps: true })

export const Enterprise = model<IEnterprise>("Enterprise", enterprise)