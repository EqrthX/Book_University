import pool from "../config/DB.config.js";

// ดึงรายการแจ้งเตือนทั้งหมดของผู้ใช้
export const getUserNotifications = async (userId) => {
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
    return notifications;
};

// อัปเดตสถานะการแจ้งเตือนเป็นอ่านแล้ว
export const markNotificationAsRead = async (id, userId) => {
    await pool.execute(
        `
        UPDATE notifications
        SET status = 'read'
        WHERE id = ? AND user_id = ?
        `,
        [id, userId]
    );
};
