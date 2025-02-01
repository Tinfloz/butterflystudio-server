import axios from "axios";
import { Request, Response } from "express";
import { GITHUB_REPO_API, GITHUB_USER_API } from "../utils/utils.consts";
import { resObjectMaker } from "../utils/utils.response.instance";
import { getAuthHeadersDevOps, getAuthHeadersGit, getBranchFetcherDevOps, getBranchFetcherGit, getDevOpsUrl, lengthChecker } from "../utils/utils.doc.source.utils";

const getAllReposGit = async (req: Request, res: Response): Promise<void> => {
    try {
        const { t } = req.query;
        const repos = (await axios.get(GITHUB_REPO_API, getAuthHeadersGit(t as string))).data?.map((el: Record<string, any>) => el?.name)
        res.status(200).json(
            resObjectMaker.getOkResponseObject("Here are your repos", {
                repos
            })
        )
    } catch (error: any) {
        console.error(error);
        res.status(error?.status ?? 500).json(
            error?.jsonBody ?? resObjectMaker.getErrResponseObject("Something went wrong!")
        )
    }
}

const getAllDevOpsRepos = async (req: Request, res: Response): Promise<void> => {
    try {
        const { t, org, project } = req.query;
        if (!t || !org || !project || lengthChecker(t as string) || lengthChecker(org as string) || lengthChecker(project as string)) {
            resObjectMaker.getErrThrowResponseObject(400, "Required fields are missing!")
        }
        const repos = (await axios.get(getDevOpsUrl(org as string, project as string), getAuthHeadersDevOps(t as string)))?.data?.value?.map((el: Record<string, any>) => el.name)
        res.status(200).json(
            resObjectMaker.getOkResponseObject("Here are your repos", {
                repos
            })
        )
    } catch (error: any) {
        console.error(error);
        res.status(error?.status ?? 500).json(
            error?.jsonBody ?? resObjectMaker.getErrResponseObject("Something went wrong!")
        )
    }
}

const getAllBranchesGit = async (req: Request, res: Response): Promise<void> => {
    try {
        const { t, repo } = req.query;
        if (!t || !repo || lengthChecker(t as string), lengthChecker(repo as string)) throw resObjectMaker.getErrThrowResponseObject(400, "Required parameters are missing!");
        const user = (await axios.get(GITHUB_USER_API, getAuthHeadersGit(t as string))).data.login;
        const branches = (await axios.get(getBranchFetcherGit(user, repo as string))).data?.map((el: Record<string, any>) => el?.name);
        res.status(200).json(
            resObjectMaker.getOkResponseObject("Here are your branches!", {
                branches
            })
        )
    } catch (error: any) {
        console.error(error);
        res.status(error?.status ?? 500).json(
            error?.jsonBody ?? resObjectMaker.getErrResponseObject("Something went wrong!")
        )
    }
}

const getAllBranchesDevOps = async (req: Request, res: Response): Promise<void> => {
    try {
        const { t, org, project, repo } = req.query as { t: string, org: string, project: string, repo: string };
        if (!t || !org || !project || !repo || lengthChecker(t) || lengthChecker(org) || lengthChecker(repo) || lengthChecker(project)) throw resObjectMaker.getErrThrowResponseObject(400, "Parameters are missing!");
        const branches = (await axios.get(getBranchFetcherDevOps(org, project, repo), getAuthHeadersDevOps(t)))?.data?.value?.map((el: Record<string, any>) => el?.name?.split("/")[el?.name?.split("/").length - 1]);
        res.status(200).json(
            resObjectMaker.getOkResponseObject("Here are your branches!", {
                branches
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
    getAllReposGit,
    getAllDevOpsRepos,
    getAllBranchesGit,
    getAllBranchesDevOps
}