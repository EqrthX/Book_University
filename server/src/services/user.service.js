import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { User } from '../models/index.js';

// ลงทะเบียนผู้ใช้ใหม่
export const registerUser = async (studentId, fullName, email, password) => {
    // ตรวจสอบว่าผู้ใช้มีอยู่แล้ว
    const existingUser = await User.findOne({
        where: {
            [Op.or]: [
                { studentId },
                { email }
            ]
        }
    });

    if (existingUser) {
        const error = new Error("Student Id or Email already exists!");
        error.statusCode = 409;
        throw error;
    }

    // เข้ารหัส Password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // บันทึกผู้ใช้ใหม่
    const newUser = await User.create({
        studentId,
        fullName,
        email,
        password: hashedPassword
    });

    return {
        id: newUser.id,
        studentId: newUser.studentId,
        fullName: newUser.fullName,
        email: newUser.email
    };
};

// เข้าสู่ระบบ
export const authenticateUser = async (email, studentId, password) => {
    // ค้นหาผู้ใช้
    const conditions = [];
    if (studentId) conditions.push({ studentId });
    if (email) conditions.push({ email });

    if (conditions.length === 0) {
        const error = new Error("Invalid Student ID or Email");
        error.statusCode = 401;
        throw error;
    }

    const user = await User.findOne({
        where: {
            [Op.or]: conditions
        }
    });

    if (!user) {
        const error = new Error("Invalid Student ID or Email");
        error.statusCode = 401;
        throw error;
    }

    // ตรวจสอบ Password
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
        const error = new Error("Password not match");
        error.statusCode = 401;
        throw error;
    }

    return {
        id: user.id,
        studentId: user.studentId,
        email: user.email,
        user_role: user.user_role,
    };
};

// ดึงข้อมูลผู้ใช้จาก Token
export const verifyToken = async (token, jwtSecret) => {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
};


