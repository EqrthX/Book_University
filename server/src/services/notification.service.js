import { Notification, Order } from "../models/index.js";

// ดึงรายการแจ้งเตือนทั้งหมดของผู้ใช้
export const getUserNotifications = async (userId, limit = 50, offset = 0) => {
    const lim = Math.max(1, parseInt(limit, 10) || 50);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    const notifications = await Notification.findAll({
        where: { user_id: userId },
        include: [{
            model: Order,
            as: "order",
            attributes: ["status"]
        }],
        order: [["created_at", "DESC"]],
        limit: lim,
        offset: off
    });

    return notifications.map(n => {
        const plain = n.get({ plain: true });
        return {
            id: plain.id,
            user_id: plain.user_id,
            title_message: plain.Title_message,
            message: plain.message,
            status: plain.status,
            created_at: plain.created_at,
            order_status: plain.order?.status || null
        };
    });
};

// อัปเดตสถานะการแจ้งเตือนเป็นอ่านแล้ว
export const markNotificationAsRead = async (id, userId) => {
    await Notification.update(
        { status: 'read' },
        { where: { id, user_id: userId } }
    );
};

