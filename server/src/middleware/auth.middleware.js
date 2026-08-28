import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // เก็บข้อมูล User ไว้ใน req เพื่อใช้ต่อใน Controller

        // อัปเดตเวลาการใช้งานล่าสุดของผู้ใช้แบบ async (ไม่บล็อก request หลัก)
        if (decoded && decoded.id) {
            User.update(
                { lastActiveAt: new Date() },
                { where: { id: decoded.id } }
            ).catch(err => console.error("Error updating user lastActiveAt:", err));
        }

        next();
    } catch (error) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
};