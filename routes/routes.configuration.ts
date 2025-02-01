import { Router } from "express";
import { authenticateUsers } from "../middlewares/middlewares.auth";
import { configureApiKeysForScraper, configureDocumentSource, configureEnterprise, configureDocumentIntegration } from "../controllers/controllers.configure";

let router = Router();

router.route("/configure-enterprise").post(authenticateUsers, configureEnterprise);
router.route("/configure-keys-marketing").post(authenticateUsers, configureApiKeysForScraper);
router.route("/configure-document-search").post(authenticateUsers, configureDocumentSource);
router.route("/configure-document-integration").post(authenticateUsers, configureDocumentIntegration);

export default router;