import jwt, { JwtPayload } from "jsonwebtoken";
import { Users } from "../models/models.users";
import { Request, Response, NextFunction } from "express";
import { resObjectMaker } from "../utils/utils.response.instance";

export const authenticateUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const headers = req?.headers?.authorization;
        if (!headers) throw resObjectMaker.getErrThrowResponseObject(401, "Headers are absent!");
        if (!headers.startsWith("Bearer")) throw resObjectMaker.getErrThrowResponseObject(401, "Incorrect header format");
        const token = headers.split(" ")[1];
        const { id } = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        if (!id) throw resObjectMaker.getErrThrowResponseObject(401, "Header signature not valid!");
        req.user = await Users.findById(id);
        if (!req.user) throw resObjectMaker.getErrThrowResponseObject(404, "No such user found!");
        next();
    } catch (error: any) {
        console.error(error);
        res.status(error?.status ?? 500).json(
            error.jsonBody ?? resObjectMaker?.getErrResponseObject("Something went wrong!")
        )
    }
}