import { Request, Response } from "express";
import { resObjectMaker } from "../utils/utils.response.instance";
import { IUser } from "../interfaces/interface.user";
import { Enterprise } from "../models/models.enterprise";
import { Users } from "../models/models.users";
import { IConfigureEnterprise, IMarketingAgentConfig } from "../interfaces/interface.enterprise";
import { ScraperApiKeys } from "../models/models.api.keys.marketing";
import { DocumentSource } from "../models/models.document.source";
import { DOC_INTEGRATIONS, GET_ACCESS_TOKEN_GITHUB } from "../utils/utils.consts";
import { DocIntegration } from "../models/models.doc.integration";
import { lengthChecker } from "../utils/utils.doc.source.utils";
import { SlackIntegration } from "../models/models.slack.integration";
import { storageAccQueue } from "../queues/queues.create.storageacc";
import { randomUUID } from "crypto";
import axios from "axios";

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
        const newJob = `sacreator-${randomUUID()}`
        await storageAccQueue.add(
            newJob,
            {
                storageAccName: enterprise.toLowerCase().replace(/ /g, ""),
                objId: newEnterprise._id,
                timestamp: new Date().toISOString()
            },
            {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
                jobId: newJob,
                removeOnComplete: {
                    age: 3600,
                    count: 1000
                },
                removeOnFail: {
                    age: 24 * 3600
                }
            }
        )
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
            resObjectMaker.getOkResponseObject("API Keys stored successfully!", {
                keyConfigId: newMarketingAgentKeys._id
            })
        )
    } catch (error: any) {
        console.error(error);
        res.status(error?.status ?? 500).json(
            error?.jsonBody ?? resObjectMaker.getErrResponseObject("Something went wrong!")
        )
    }
}

const devopsIntegration = async (req: Request, res: Response): Promise<void> => {
    try {
        const { personalAccessToken } = req.body;
        if (!personalAccessToken || lengthChecker(personalAccessToken)) throw resObjectMaker.getErrThrowResponseObject(400, "Invalid parameters!");
        const { enterprise } = req.user as IUser;
        const newDocumentSource = await DocumentSource.create({
            ...req.body,
            repoType: "DevOps",
            enterprise
        });
        if (!newDocumentSource) throw resObjectMaker.getErrThrowResponseObject(500, "Could not add document source!");
        res.status(201).json(
            resObjectMaker.getOkResponseObject("Document source added successfully!", {
                repoType: "DevOps",
                devopsIntegrationId: newDocumentSource._id
            })
        )
    } catch (error: any) {
        console.error(error);
        res.status(error?.status ?? 500).json(
            error?.jsonBody ?? resObjectMaker.getErrResponseObject("Something went wrong!")
        )
    }
}

const configureDocumentIntegration = async (req: Request, res: Response): Promise<void> => {
    try {
        const { repo, branch, docSourceType, ...rest } = req.body;
        if (!repo || !branch || !docSourceType || lengthChecker(repo) || lengthChecker(branch) || lengthChecker(docSourceType)) throw resObjectMaker.getErrThrowResponseObject(400, "Fields are missing!");
        if (Object.keys(rest)?.length === 0) throw resObjectMaker.getErrThrowResponseObject(400, "Required fields are missing!");
        if (!DOC_INTEGRATIONS.includes(docSourceType)) throw resObjectMaker.getErrThrowResponseObject(400, "Illegal source type!");
        if (docSourceType === "DevOps" && (!rest.org || !rest.project)) throw resObjectMaker.getErrThrowResponseObject(400, "Project and Organisation required for DevOps!");
        if (docSourceType === "GitHub" && !rest.owner) throw resObjectMaker.getErrThrowResponseObject(400, "User required for GitHub!");
        const { enterprise } = req.user as IUser;
        const newDocumentIntegration = await DocIntegration.create({
            enterprise,
            ...req.body
        })
        if (!newDocumentIntegration) throw resObjectMaker.getErrThrowResponseObject(500, "Could not create a new integration");
        res.status(200).json(
            resObjectMaker.getOkResponseObject("New integration has been created!", {
                ...req.body,
                docIntegrationId: newDocumentIntegration._id
            })
        )
    } catch (error: any) {
        console.error(error);
        res.status(error?.status ?? 500).json(
            error?.jsonBody ?? resObjectMaker.getErrResponseObject("Something went wrong!")
        )
    }
}

const configureSlack = async (req: Request, res: Response): Promise<void> => {
    try {
        const { channelId, slackOAuth } = req.body;
        if (!channelId || !slackOAuth || lengthChecker(channelId) || lengthChecker(slackOAuth)) throw resObjectMaker.getErrThrowResponseObject(400, "Required parameters are missing!");
        const { enterprise } = req.user as IUser;
        const newSlackIntegration = await SlackIntegration.create({
            ...req.body,
            enterprise
        })
        res.status(200).json(
            resObjectMaker.getOkResponseObject("Slack integration created successfully!", {
                ...req.body,
                slackConfigId: newSlackIntegration._id
            })
        )
    } catch (error: any) {
        console.error(error);
        res.status(error?.status ?? 500).json(
            error?.jsonBody ?? resObjectMaker.getErrResponseObject("Something went wrong!")
        )
    }
}

const githubIntegration = async (req: Request, res: Response): Promise<void> => {
    try {
        const { code } = req.body;
        if (!code || lengthChecker(code)) throw resObjectMaker.getErrThrowResponseObject(400, "Invalid oauth code for GitHub!");
        const { enterprise } = req.user as IUser;
        const token = (await axios.post(GET_ACCESS_TOKEN_GITHUB, {
            client_id: process.env.CLIENT_ID_GITHUB,
            client_secret: process.env.CLIENT_SECRET_GITHUB,
            code,
            redirect_uri: process.env.REDIRECT_URI_GITHUB
        }, {
            headers: {
                Accept: 'application/json'
            }
        }))?.data?.access_token
        if (!token) throw resObjectMaker.getErrThrowResponseObject(401, "Could not authenticate GitHub");
        const newDocumentSource = await DocumentSource.create({
            enterprise,
            repoType: "GitHub",
            personalAccessToken: token
        })
        if (!newDocumentSource) throw resObjectMaker.getErrThrowResponseObject(500, "Could not create a new integration");
        res.status(201).json(
            resObjectMaker.getOkResponseObject("GitHub source successfully created!", {
                repoType: "GitHub",
                githubIntegrationId: newDocumentSource._id
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
    configureEnterprise,
    configureApiKeysForScraper,
    devopsIntegration,
    configureDocumentIntegration,
    configureSlack,
    githubIntegration
}
