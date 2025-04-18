import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import upload from "../middleware/upload.middleware.js";
import { getMessages, sendMessage, showAllUsersToChat } from '../controllers/messages.controller.js';
const router = express.Router();

router.get("/show-all-users", verifyToken, showAllUsersToChat)
router.post("/send", verifyToken, upload, sendMessage)
router.get("/:sender_id/:receiver_id", verifyToken, getMessages)

export default router;