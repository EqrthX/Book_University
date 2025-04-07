import pool from '../config/DB.config.js';
import multer from 'multer';

export const showAllUsersToChat = async (req, res) => {
    try {

        const userId = req.user?.id

        const [rows] = await pool.execute(
            `SELECT * FROM users WHERE user_role = 'student' AND id != ?`,
            [userId]
        )

        if(rows.length === 0) {
            return res.status(404).json({ message: "ไม่เจอผู้ใช้งาน" })
        }

        return res.status(200).json({
            message: "แสดงผู้ใช้งานทั้งหมด",
            users: rows
        })

    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { sender, receiver, text: message } = req.body;

        if (!sender || !receiver || !message) {
            return res.status(400).json({ message: "ไม่พบข้อมูล" });
        }

        const [result] = await pool.execute(
            `INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)`,
            [sender, receiver, message]
        );

        // ส่งข้อความที่เพิ่งบันทึกกลับไปยังไคลเอนต์
        return res.status(200).json({
            message: "ส่งข้อความเรียบร้อยแล้ว",
            data: {
                id: result.insertId,
                sender,
                receiver,
                text: message,
                created_at: new Date(), // เพิ่ม timestamp
            },
        });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { sender_id, receiver_id } = req.params;

        if (!sender_id || !receiver_id) {
            return res.status(400).json({ message: "ไม่พบข้อมูล" });
        }

        const [rows] = await pool.execute(
            `
            SELECT id, sender_id AS sender, receiver_id AS receiver, message AS text, created_at
            FROM messages
            WHERE (sender_id = ? AND receiver_id = ?)
            OR (sender_id = ? AND receiver_id = ?)
            ORDER BY created_at ASC
            `,
            [sender_id, receiver_id, receiver_id, sender_id]
        );

        return res.status(200).json({
            message: "แสดงข้อความทั้งหมด",
            messages: rows,
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};