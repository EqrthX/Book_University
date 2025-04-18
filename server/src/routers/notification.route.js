import express from 'express'

import { verifyToken } from '../middleware/auth.middleware.js'
import { getNotifications, getStatusForNotifications, updateNotificationStatus } from '../controllers/notification.controller.js'

const router = express.Router()

router.get("/getNotifications", verifyToken, getNotifications)

router.put("/updateNotificationStatus", verifyToken, updateNotificationStatus)

export default router