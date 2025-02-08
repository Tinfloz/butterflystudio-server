import { Router } from "express";
import { authenticateUsers } from "../middlewares/middlewares.auth";
import { configureApiKeysForScraper, devopsIntegration, configureEnterprise, configureDocumentIntegration, configureSlack, githubIntegration } from "../controllers/controllers.configure";

let router = Router();

router.route("/configure-enterprise").post(authenticateUsers, configureEnterprise);
router.route("/configure-keys-marketing").post(authenticateUsers, configureApiKeysForScraper);
router.route("/configure-devops-integration").post(authenticateUsers, devopsIntegration);
router.route("/configure-document-integration").post(authenticateUsers, configureDocumentIntegration);
router.route("/configure-slack").post(authenticateUsers, configureSlack);
router.route("/configure-github-integration").post(authenticateUsers, githubIntegration)

export default router;