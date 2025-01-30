import { model, Schema, Types } from "mongoose";
import { EMAIL_REGEX } from "../utils/utils.consts";
import bcrypt from "bcryptjs";
import { IUser } from "../interfaces/interface.user";

const users = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        match: [EMAIL_REGEX, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    enterprise:{
        type:Types.ObjectId,
        ref:"Enterprise"
    },
    googleUserId: {
        type: String,
        required: false
    },
}, { timestamps: true })

users.pre("save", async function (next: any): Promise<void> {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
})

users.methods.matchPassword = async function (enteredPwd: string): Promise<boolean> {
    return bcrypt.compare(enteredPwd, this.password)
}

export const Users = model<IUser>("Users", users)