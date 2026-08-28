import pool from '../config/DB.config.js';

// ดึงผู้ใช้งานทั้งหมดที่เป็นนักเรียน ยกเว้นตัวเอง
export const getAllUsersToChat = async (userId, limit = 50, offset = 0) => {
    const lim = Math.max(1, parseInt(limit, 10) || 50);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    const [rows] = await pool.query(
        `SELECT * FROM users WHERE user_role = 'student' AND id != ? LIMIT ? OFFSET ?`,
        [userId, lim, off]
    );
    return rows;
};

// บันทึกข้อความการสนทนาใหม่
export const saveMessage = async (sender, receiver, message, picture) => {
    const [result] = await pool.execute(
        `INSERT INTO messages (sender_id, receiver_id, message, img) VALUES (?, ?, ?, ?)`,
        [sender, receiver, message || "", picture]
    );
    return result.insertId;
};

// ดึงข้อความสนทนาระหว่างคู่สนทนา
export const fetchMessagesBetweenUsers = async (senderId, receiverId, limit = 100, offset = 0) => {
    const lim = Math.max(1, parseInt(limit, 10) || 100);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    const [rows] = await pool.query(
        `
        SELECT id, sender_id AS sender, receiver_id AS receiver, img AS picture, message AS text, created_at
        FROM messages
        WHERE (sender_id = ? AND receiver_id = ?)
        OR (sender_id = ? AND receiver_id = ?)
        ORDER BY created_at ASC
        LIMIT ? OFFSET ?
        `,
        [senderId, receiverId, receiverId, senderId, lim, off]
    );
    return rows;
};
