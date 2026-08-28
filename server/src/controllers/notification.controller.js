import * as notificationService from "../services/notification.service.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user?.id;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : (page - 1) * limit;

        if (!userId) {
            return res.status(401).json({ message: "User ID is missing or invalid" });
        }

        const notifications = await notificationService.getUserNotifications(userId, limit, offset);

        return res.status(200).json({
            message: notifications.length === 0 ? "ไม่มีการแจ้งเตือน" : "แสดงการแจ้งเตือน",
            notifications: notifications || []
        });

    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            message: error.message
        });
    }
};

export const updateNotificationStatus = async (req, res) => {
    try {
        const { id } = req.body || {};
        const notificationId = req.params.id || id;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "ไม่เจอ User Id นี้" });
        }
        if (!notificationId) {
            return res.status(400).json({ message: "ไม่เจอการแจ้งเตือนนี้" });
        }

        await notificationService.markNotificationAsRead(notificationId, userId);

        return res.status(200).json({
            message: "อัปเดตสถานะการแจ้งเตือนเรียบร้อยแล้ว",
        });
        
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            message: error.message
        });
    }
}