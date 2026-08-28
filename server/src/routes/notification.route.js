import express from 'express';
import { getNotifications, updateNotificationStatus } from '../controllers/notification.controller.js';

const router = express.Router();

// RESTful Resource-based routes
router.get("/", getNotifications);
router.put("/status", updateNotificationStatus);
router.put("/:id/read", updateNotificationStatus);

// Legacy action-based route aliases
router.get("/getNotifications", getNotifications);
router.put("/updateNotificationStatus", updateNotificationStatus);

export default router;
