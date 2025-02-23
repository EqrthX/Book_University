import express from "express"
import { login, logout, protectedToken, signup } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.get("/protected", protectedToken)
router.post("/logout", logout)

export default router;