import { Schema, Document } from "mongoose";

export interface IUser extends Document {
    _id: Schema.Types.ObjectId,
    email: string,
    password: string,
    name: string,
    enterprise: Schema.Types.ObjectId,
    matchPassword: (enteredPwd: string) => Promise<boolean>
}

export interface IAuthSignUp {
    name: string,
    email: string,
    password: string
}

export interface IAuthSignIn {
    cred: string,
    password: string
}