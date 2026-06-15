import express from 'express';
import upload from "../middleware/upload.middleware.js";
import { getMessages, sendMessage, showAllUsersToChat } from '../controllers/messages.controller.js';
const router = express.Router();

router.get("/show-all-users", showAllUsersToChat)
router.post("/send", upload, sendMessage)
router.get("/:sender_id/:receiver_id", getMessages)

export default router;
