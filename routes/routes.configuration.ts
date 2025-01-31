import { Router } from "express";
import { authenticateUsers } from "../middlewares/middlewares.auth";
import { configureApiKeysForScraper, configureDocumentSource, configureEnterprise, getAllReposGit } from "../controllers/controllers.configure";

let router = Router();

router.route("/configure-enterprise").post(authenticateUsers, configureEnterprise);
router.route("/configure-keys-marketing").post(authenticateUsers, configureApiKeysForScraper);
router.route("/configure-document-search").post(authenticateUsers, configureDocumentSource);
router.route("/get-repos-git").get(authenticateUsers, getAllReposGit);

export default router;