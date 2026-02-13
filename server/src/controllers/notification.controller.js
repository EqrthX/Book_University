import pool from "../config/DB.config.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user?.id; // ดึง userId จาก req.user
        if (!userId) {
            return res.status(400).json({ message: "User ID is missing or invalid" });
        }

        const [notifications] = await pool.execute(
            `
            SELECT 
                n.id, 
                n.user_id,
                n.Title_message AS title_message,
                n.message AS message,
                n.status,
                n.created_at,
                o.status AS order_status
            FROM notifications n
            LEFT JOIN orders o ON o.id = n.order_id
            WHERE n.user_id = ?
            `,
            [userId]
        );

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
        const userId = req.user?.id; // ดึง userId จาก req.user 

        if(!userId) {
            return res.status(400).json({ message: "ไม่เจอ User Id นี้" });
        }
        if(!id) {
            return res.status(400).json({ message: "ไม่เจอการแจ้งเตือนนี้" });
        }

        await pool.execute(
            `
            UPDATE notifications
            SET status = 'read'
            WHERE id = ? AND user_id = ?
            `,
            [id, userId]
        )

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