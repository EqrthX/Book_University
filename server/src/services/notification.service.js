import pool from "../config/DB.config.js";

// ดึงรายการแจ้งเตือนทั้งหมดของผู้ใช้
export const getUserNotifications = async (userId, limit = 50, offset = 0) => {
    const lim = Math.max(1, parseInt(limit, 10) || 50);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    const [notifications] = await pool.query(
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
        ORDER BY n.created_at DESC
        LIMIT ? OFFSET ?
        `,
        [userId, lim, off]
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
