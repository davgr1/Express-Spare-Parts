import express from "express";
import loginClientesController from "../controllers/loginClientesController.js";

const router = express.Router();

router.route("/").post(loginClientesController.login);
router.route("/forgotPassword").post(loginClientesController.forgotPassword);
router.route("/resetPassword").post(loginClientesController.resetPassword);

export default router;