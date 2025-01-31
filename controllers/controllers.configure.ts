import { Request, Response } from "express";
import { resObjectMaker } from "../utils/utils.response.instance";
import { IUser } from "../interfaces/interface.user";
import { Enterprise } from "../models/models.enterprise";
import { Users } from "../models/models.users";
import { IConfigureEnterprise, IMarketingAgentConfig } from "../interfaces/interface.enterprise";
import { ScraperApiKeys } from "../models/models.api.keys.marketing";
import { ServiceBusClient } from "@azure/service-bus";
import { DocumentSource } from "../models/models.document.source";
import axios from "axios";
import { GITHUB_REPO_API } from "../utils/utils.consts";

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
        const sbClient = new ServiceBusClient(process.env.SB_CLIENT!);
        const sbSender = sbClient.createSender(process.env.ENTERPRISE_QUEUE!);
        try {
            await sbSender.sendMessages({
                body: {
                    enterprise,
                    objId: newEnterprise._id
                }
            })
        } catch (error) {
            console.error(error);
            throw resObjectMaker.getErrThrowResponseObject(500, "Something failed while creating enterprise");
        } finally {
            await sbSender.close();
            await sbClient.close();
        }
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

const configureApiKeysForScraper = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firecrawlKey, serperKey } = req.body as IMarketingAgentConfig;
        if (!firecrawlKey || !serperKey || firecrawlKey.trim().length === 0 || serperKey.trim().length === 0) throw resObjectMaker.getErrThrowResponseObject(400, "API Keys are missing!");
        const { enterprise } = req.user as IUser;
        const newMarketingAgentKeys = await ScraperApiKeys.create({
            ...req.body,
            enterprise
        })
        if (!newMarketingAgentKeys) throw resObjectMaker.getErrThrowResponseObject(500, "Could not store API Keys!");
        res.status(201).json(
            resObjectMaker.getOkResponseObject("API Keys stored successfully!")
        )
    } catch (error: any) {
        console.error(error);
        res.status(error?.status ?? 500).json(
            error?.jsonBody ?? resObjectMaker.getErrResponseObject("Something went wrong!")
        )
    }
}

const configureDocumentSource = async (req: Request, res: Response): Promise<void> => {
    try {
        const { type, personalToken } = req.body;
        if (!type || !personalToken || type.trim().length === 0 || personalToken.trim().length === 0) throw resObjectMaker.getErrThrowResponseObject(400, "Invalid parameters!");
        const newDocumentSource = await DocumentSource.create(req.body);
        if (!newDocumentSource) throw resObjectMaker.getErrThrowResponseObject(500, "Could not add document source!");
        res.status(201).json(
            resObjectMaker.getOkResponseObject("Document source added successfully!", req.body)
        )
    } catch (error: any) {
        console.error(error);
        res.status(error?.status ?? 500).json(
            error?.jsonBody ?? resObjectMaker.getErrResponseObject("SOmething went wrong!")
        )
    }
}

const getAllReposGit = async (req: Request, res: Response): Promise<void> => {
    try {
        const { t } = req.query; 
        const repos = (await axios.get(GITHUB_REPO_API, { 
            headers:{
                Authorization:`token ${t}`
            }
        })).data
        res.status(200).json(
            resObjectMaker.getOkResponseObject("Here are your repos", {
                repos
            })
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
    configureApiKeysForScraper,
    configureDocumentSource,
    getAllReposGit
}