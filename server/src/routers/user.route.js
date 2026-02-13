import express from "express";
import { login, logout, protectedToken, signup } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check-auth", protectedToken); // Route สำหรับตรวจสอบ Token ฝั่ง Frontend

export default router;