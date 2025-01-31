import { Request, Response } from "express";
import { Users } from "../models/models.users";
import { resObjectMaker } from "../utils/utils.response.instance";
import { EMAIL_REGEX } from "../utils/utils.consts";
import { createJwtToken } from "../utils/utils.get.token";
import { IAuthSignIn, IAuthSignUp } from "../interfaces/interface.user";

const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, name, password } = req.body as IAuthSignUp;
        if (!email || !name || !password || email.trim().length === 0 || name.trim().length === 0 || password.trim().length === 0) throw resObjectMaker.getErrThrowResponseObject(400, "Parameters are missing!");
        const newUser = await Users.create(req.body);
        if (!newUser) throw resObjectMaker.getErrThrowResponseObject(500, "User could not be created");
        res.status(201).json(
            resObjectMaker.getOkResponseObject("User created successully!", {
                email,
                name
            })
        )
    } catch (error: any) {
        console.error(error);
        res.status(error?.status ?? 500).json(
            error?.jsonBody ?? resObjectMaker.getErrResponseObject("Something went wrong!")
        )
    }
}

const signIn = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cred, password } = req.body as IAuthSignIn;
        if (!cred || !password || cred.trim().length === 0 || password.trim().length === 0) throw resObjectMaker.getErrThrowResponseObject(400, "Required fields are missing!");
        const email = EMAIL_REGEX.test(cred);
        const user = await Users.findOne(email ? { email: cred } : { name: cred });
        if (!user) throw resObjectMaker.getErrThrowResponseObject(404, "No such user found");
        if (!await user.matchPassword(password)) throw resObjectMaker.getErrThrowResponseObject(400, "Passwords don't match!");
        res.status(200).json(
            resObjectMaker.getOkResponseObject("Welcome to Butterfly Studio!", {
                id: user._id,
                name: user.name,
                email: user.email,
                enterprise: user.enterprise,
                token: createJwtToken(user._id)
            })
        )
    } catch (error: any) {
        console.error(error);
        res.status(error?.status ?? 500).json(
            error?.jsonBody ?? resObjectMaker.getErrResponseObject("Something went wrong!")
        )
    }
}

export {
    signUp, signIn
}