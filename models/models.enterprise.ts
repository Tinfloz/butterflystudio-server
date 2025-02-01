import { Schema, Types, model } from "mongoose";
import { IEnterprise } from "../interfaces/interface.enterprise";

const enterprise = new Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    createdBy: {
        type: Types.ObjectId,
        required: true,
        ref: "Users"
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true })

export const Enterprise = model<IEnterprise>("Enterprise", enterprise)