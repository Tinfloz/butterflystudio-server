import { Request, Response } from "express";
import { Users } from "../models/models.users";
import { resObjectMaker } from "../utils/utils.response.instance";
import { EMAIL_REGEX } from "../utils/utils.consts";
import { createJwtToken } from "../utils/utils.get.token";
import { OAuth2Client } from "google-auth-library";

const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, name, password } = req.body;
        if (!email || !name || !password) throw resObjectMaker.getErrThrowResponseObject(400, "Parameters are missing!");
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
        const { cred, password } = req.body;
        if (!cred || !password) throw resObjectMaker.getErrThrowResponseObject(400, "Required fields are missing!");
        const email = EMAIL_REGEX.test(cred);
        const user = await Users.findOne(email ? { email: cred } : { name: cred });
        if (!user) throw resObjectMaker.getErrThrowResponseObject(404, "No such user found");
        if (!await user.matchPassword(password)) throw resObjectMaker.getErrThrowResponseObject(400, "Passwords don't match!");
        res.status(200).json(
            resObjectMaker.getOkResponseObject("Welcome to Butterfly Studio!", {
                id: user._id,
                name: user.name,
                email: user.email,
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

const loginWithGoogle = async (req:Request,res:Response):Promise<void>=>{
    try{
        const {googleOAuthToken}=req.body;
        if (!googleOAuthToken) throw resObjectMaker.getErrThrowResponseObject(400, "Required fields are missing!");
        const client = new OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken: googleOAuthToken,
            audience: process.env["GOOGLE_LOGIN_CLIENT_ID"]
        });
        const payload = ticket.getPayload();
        const userid = payload?.sub
        let userInMongo=await Users.findOne({email:payload?.email})
        if(!userInMongo) {
            userInMongo =  await Users.create({
                email:payload?.email,
                password:"",
                name: payload?.name,
                googleUserId: userid
            })
        }
        res.status(200).json(
            resObjectMaker.getOkResponseObject("Welcome to Butterfly Studio!", {
                id: userInMongo._id,
                name:userInMongo.name,
                email: userInMongo.email,
                token: createJwtToken(userInMongo._id)
            })
        )
        
        // If the request specified a Google Workspace domain:
        // const domain = payload['hd'];
    }
    catch (error: any) {
        console.error(error);
        res.status(error?.status ?? 500).json(
            error?.jsonBody ?? resObjectMaker.getErrResponseObject("Something went wrong!")
        )
    }
    


}

export {
    signUp, signIn, loginWithGoogle
}