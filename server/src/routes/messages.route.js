import express from 'express';
import upload from "../middleware/upload.middleware.js";
import { getMessages, sendMessage, showAllUsersToChat } from '../controllers/messages.controller.js';

const router = express.Router();

// RESTful Resource-based routes
router.get("/users", showAllUsersToChat);
router.post("/", upload, sendMessage);
router.get("/:sender_id/:receiver_id", getMessages);

// Legacy action-based route aliases
router.get("/show-all-users", showAllUsersToChat);
router.post("/send", upload, sendMessage);

export default router;
