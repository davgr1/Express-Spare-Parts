import express from "express";
import loginClientesController from "../controllers/loginClientesController.js";

const router = express.Router();

router.route("/").post(loginClientesController.login);

export default router;