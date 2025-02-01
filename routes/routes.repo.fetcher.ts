import { Router } from "express";
import { getAllBranchesDevOps, getAllBranchesGit, getAllDevOpsRepos, getAllReposGit } from "../controllers/controllers.repo.fetcher";
import { authenticateUsers } from "../middlewares/middlewares.auth";

let router = Router();

router.route("/fetch-repos-git").get(authenticateUsers, getAllReposGit);
router.route("/fetch-repos-devops").get(authenticateUsers, getAllDevOpsRepos);
router.route("/fetch-branches-git").get(authenticateUsers, getAllBranchesGit);
router.route("/fetch-branches-devops").get(authenticateUsers, getAllBranchesDevOps);


export default router;