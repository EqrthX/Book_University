import * as messagesService from "../services/messages.service.js";

export const showAllUsersToChat = async (req, res) => {
    try {
        const userId = req.user?.id;
        const rows = await messagesService.getAllUsersToChat(userId);

        if(rows.length === 0) {
            return res.status(404).json({ message: "ไม่เจอผู้ใช้งาน" });
        }

        return res.status(200).json({
            message: "แสดงผู้ใช้งานทั้งหมด",
            users: rows
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { sender, receiver, text: message } = req.body;
        const picture = req.files?.picture_message?.[0]?.path.replace(/\\/g, "/") || null;

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
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { sender_id, receiver_id } = req.params;

        if (!sender_id || !receiver_id) {
            return res.status(400).json({ message: "ไม่พบข้อมูล" });
        }

        const rows = await messagesService.fetchMessagesBetweenUsers(sender_id, receiver_id);

        return res.status(200).json({
            message: "แสดงข้อความทั้งหมด",
            messages: rows,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
