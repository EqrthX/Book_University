import express from 'express'

import { getNotifications, updateNotificationStatus } from '../controllers/notification.controller.js'

const router = express.Router()

router.get("/getNotifications", getNotifications)

router.put("/updateNotificationStatus", updateNotificationStatus)

export default router
