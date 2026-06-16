import pool from '../config/DB.config.js';

// ดึงผู้ใช้งานทั้งหมดที่เป็นนักเรียน ยกเว้นตัวเอง
export const getAllUsersToChat = async (userId) => {
    const [rows] = await pool.execute(
        `SELECT * FROM users WHERE user_role = 'student' AND id != ?`,
        [userId]
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
export const fetchMessagesBetweenUsers = async (senderId, receiverId) => {
    const [rows] = await pool.execute(
        `
        SELECT id, sender_id AS sender, receiver_id AS receiver, img AS picture, message AS text, created_at
        FROM messages
        WHERE (sender_id = ? AND receiver_id = ?)
        OR (sender_id = ? AND receiver_id = ?)
        ORDER BY created_at ASC
        `,
        [senderId, receiverId, receiverId, senderId]
    );
    return rows;
};
