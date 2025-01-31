import { Router } from "express";
import { authenticateUsers } from "../middlewares/middlewares.auth";
import { createConfigurations ,getConfigurationsById,getConfigurationsByTemplateId,getConfigurationsByType,getAllConfigurations} from "../controllers/controllers.general.configurations";
let router = Router();

router.route("/").post(authenticateUsers,createConfigurations );
router.route("/:id").get(authenticateUsers,getConfigurationsById );
router.route("/template/:templateId").get(authenticateUsers,getConfigurationsByTemplateId );
router.route("/type/:type").get(authenticateUsers,getConfigurationsByType );
router.route("/").get(authenticateUsers,getAllConfigurations );
export default router;
