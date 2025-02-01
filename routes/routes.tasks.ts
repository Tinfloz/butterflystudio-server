import {Router} from "express";
import { configureTasks, getQueueStatus } from "../controllers/controllers.tasks";

let router = Router();

router.route("/configure-tasks").post(configureTasks);
router.route("/task-status").get(getQueueStatus)

export default router;