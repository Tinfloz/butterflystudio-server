import { Schema, Document } from "mongoose";

export interface IUser extends Document {
    _id: Schema.Types.ObjectId,
    email: string,
    password: string,
    name: string,
    matchPassword: (enteredPwd: string) => Promise<boolean>
}