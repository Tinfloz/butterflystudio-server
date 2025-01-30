import { Router } from "express";
import { loginWithGoogle, signIn, signUp } from "../controllers/controllers.auth";

let router = Router();

router.route("/sign-up").post(signUp);
router.route("/sign-in").post(signIn);
router.route("/sign-in/google").post(loginWithGoogle)

export default router;