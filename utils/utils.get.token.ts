import jwt from "jsonwebtoken";
import { Schema } from "mongoose";
import { JWT_EXPIRY } from "./utils.consts";

export const createJwtToken = (id:Schema.Types.ObjectId):string => {
    return jwt.sign({id}, process.env.JWT_SECRET!, {
        expiresIn:JWT_EXPIRY
    })
}