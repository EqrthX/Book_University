import { User, Message } from "../models/index.js";
import { Op } from "sequelize";

// ดึงผู้ใช้งานทั้งหมดที่เป็นนักเรียน ยกเว้นตัวเอง
export const getAllUsersToChat = async (userId, limit = 50, offset = 0, targetUserId = null) => {
    const lim = Math.max(1, parseInt(limit, 10) || 50);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    const users = await User.findAll({
        where: {
            user_role: "student",
            id: { [Op.ne]: userId }
        },
        limit: lim,
        offset: off,
        raw: true
    });

    if (targetUserId) {
        const targetIdNum = parseInt(targetUserId, 10);
        if (targetIdNum && targetIdNum !== userId && !users.some(u => u.id === targetIdNum)) {
            const targetUser = await User.findByPk(targetIdNum, { raw: true });
            if (targetUser) {
                users.unshift(targetUser);
            }
        }
    }

    return users;
};

// บันทึกข้อความการสนทนาใหม่
export const saveMessage = async (sender, receiver, message, picture) => {
    const msg = await Message.create({
        sender_id: sender,
        receiver_id: receiver,
        message: message || "",
        img: picture
    });
    return msg.id;
};

// ดึงข้อความสนทนาระหว่างคู่สนทนา
export const fetchMessagesBetweenUsers = async (senderId, receiverId, limit = 100, offset = 0) => {
    const lim = Math.max(1, parseInt(limit, 10) || 100);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    const messages = await Message.findAll({
        where: {
            [Op.or]: [
                { sender_id: senderId, receiver_id: receiverId },
                { sender_id: receiverId, receiver_id: senderId }
            ]
        },
        order: [["created_at", "ASC"]],
        limit: lim,
        offset: off,
        raw: true
    });

    return messages.map(msg => ({
        id: msg.id,
        sender: msg.sender_id,
        receiver: msg.receiver_id,
        picture: msg.img,
        text: msg.message,
        created_at: msg.created_at
    }));
};

