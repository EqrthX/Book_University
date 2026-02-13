import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // เก็บข้อมูล User ไว้ใน req เพื่อใช้ต่อใน Controller
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
};