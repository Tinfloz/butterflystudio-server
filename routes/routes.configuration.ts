import { Router } from "express";
import { authenticateUsers } from "../middlewares/middlewares.auth";
import { configureApiKeysForMarketingAgent, configureEnterprise } from "../controllers/controllers.configure";

let router = Router();

router.route("/configure-enterprise").post(authenticateUsers, configureEnterprise);
router.route("/configure-keys-marketing").post(authenticateUsers, configureApiKeysForMarketingAgent);

export default router;