import { Request, Response } from "express";
import { resObjectMaker } from "../utils/utils.response.instance";
import { IUser } from "../interfaces/interface.user";
import { Enterprise } from "../models/models.enterprise";
import { Users } from "../models/models.users";
import { IConfigureEnterprise, IMarketingAgentConfig } from "../interfaces/interface.enterprise";
import { MarketingAgentKeys } from "../models/models.api.keys.marketing";

const configureEnterprise = async (req: Request, res: Response): Promise<void> => {
    try {
        const { enterprise } = req.body as IConfigureEnterprise;
        if (!enterprise || enterprise.trim().length === 0) throw resObjectMaker.getErrThrowResponseObject(400, "Parameters are missing!");
        const { _id } = req.user as IUser;
        const newEnterprise = await Enterprise.create({
            name: enterprise,
            createdBy: _id
        })
        if (!newEnterprise) throw resObjectMaker.getErrThrowResponseObject(500, "Could not create enterprise");
        await Users.findByIdAndUpdate(_id, {
            enterprise: newEnterprise._id
        })
        res.status(201).json(
            resObjectMaker.getOkResponseObject("Enterprise created successfully!", {
                enterprise
            })
        )
    } catch (error: any) {
        console.error(error);
        res.status(error?.status ?? 500).json(
            error?.jsonBody ?? resObjectMaker.getErrResponseObject("Something went wrong!")
        )
    }
}

const configureApiKeysForMarketingAgent = async (req:Request, res:Response):Promise<void> => {
    try {
        const {firecrawlKey, serperKey} = req.body as IMarketingAgentConfig;
        if (!firecrawlKey || !serperKey || firecrawlKey.trim().length === 0 || serperKey.trim().length === 0) throw resObjectMaker.getErrThrowResponseObject(400, "API Keys are missing!");
        const {enterprise} = req.user as IUser;
        const newMarketingAgentKeys = await MarketingAgentKeys.create({
            ...req.body,
            enterprise
        })
        if (!newMarketingAgentKeys) throw resObjectMaker.getErrThrowResponseObject(500, "Could not store API Keys!");
        res.status(201).json(
            resObjectMaker.getOkResponseObject("API Keys stored successfully!")
        )
    } catch (error:any) {
        console.error(error);
        res.status(error?.status ?? 500).json(
            error?.jsonBody ?? resObjectMaker.getErrResponseObject("Something went wrong!")
        )
    }
}

export {
    configureEnterprise,
    configureApiKeysForMarketingAgent
}