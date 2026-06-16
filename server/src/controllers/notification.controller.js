import * as notificationService from "../services/notification.service.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is missing or invalid" });
        }

        const notifications = await notificationService.getUserNotifications(userId);

        if (notifications.length === 0) {
            return res.status(200).json({
                message: "ไม่มีการแจ้งเตือน",
                notifications: []
            });
        }

        return res.status(200).json({
            message: "แสดงการแจ้งเตือน",
            notifications: notifications
        });

    } catch (error) {
        console.error("Error fetching notifications: ", error.message);
        return res.status(500).json({
            message: error.message
        });
    }
};

export const updateNotificationStatus = async (req, res) => {
    try {
        const {id} = req.body;
        const userId = req.user?.id;

        if(!userId) {
            return res.status(400).json({ message: "ไม่เจอ User Id นี้" });
        }
        if(!id) {
            return res.status(400).json({ message: "ไม่เจอการแจ้งเตือนนี้" });
        }

        await notificationService.markNotificationAsRead(id, userId);

        return res.status(200).json({
            message: "อัปเดตสถานะการแจ้งเตือนเรียบร้อยแล้ว",
        });
        
    } catch (error) {
        console.error("Error updating notification status: ", error.message);
        return res.status(500).json({
            message: error.message
        });
    }
}