import express from "express";
import registerCustomerController from "../controllers/registerCustomerController.js";

const router = express.Router();

router.route("/").post(registerCustomerController.register);
router.route("/verifyCodeEmail").post(registerCustomerController.verifyCode);
router.route("/resendCode").post(registerCustomerController.resendCode);

export default router;