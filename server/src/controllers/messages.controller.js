import * as messagesService from "../services/messages.service.js";
import { uploadToCloudinary } from "../config/cloudinary.config.js";

export const showAllUsersToChat = async (req, res) => {
    try {
        const userId = req.user?.id;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : (page - 1) * limit;
        const targetUserId = req.query.targetUserId || req.query.userId;

        const rows = await messagesService.getAllUsersToChat(userId, limit, offset, targetUserId);

        return res.status(200).json({
            message: "แสดงผู้ใช้งานทั้งหมด",
            users: rows || []
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { sender, receiver, text: message } = req.body;
        
        const file = req.files?.picture_message?.[0];
        let picture = null;
        if (file) {
            picture = await uploadToCloudinary(file.buffer, "chat");
        }

        if (!sender || !receiver || (!message && !picture)) {
            return res.status(400).json({ message: "ไม่พบข้อมูล" });
        }

        const insertId = await messagesService.saveMessage(sender, receiver, message, picture);

        return res.status(200).json({
            message: "ส่งข้อความเรียบร้อยแล้ว",
            data: {
                id: insertId,
                sender,
                receiver,
                text: message,
                picture,
                created_at: new Date(),
            },
        });
    } catch (error) {
        console.error("Error in sendMessage controller:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { sender_id, receiver_id } = req.params;
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 100;
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : (page - 1) * limit;

        if (!sender_id || !receiver_id) {
            return res.status(400).json({ message: "ไม่พบข้อมูล" });
        }

        const rows = await messagesService.fetchMessagesBetweenUsers(sender_id, receiver_id, limit, offset);

        return res.status(200).json({
            message: "แสดงข้อความทั้งหมด",
            messages: rows || [],
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
};
