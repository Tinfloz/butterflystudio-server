import { Router } from "express";
import { authenticateUsers } from "../middlewares/middlewares.auth";
import { getAllMasterData, getMasterDataById ,getMasterDataByName,getMasterDataByType} from "../controllers/controllers.master_data";
let router = Router();

router.route("/").get(authenticateUsers,getAllMasterData );
router.route("/:id").get(authenticateUsers, getMasterDataById );
router.route("/name/:name").get(authenticateUsers,getMasterDataByName );
router.route("/type/:type").get(authenticateUsers,getMasterDataByType );
export default router;