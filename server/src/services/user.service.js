import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/DB.config.js';

// ลงทะเบียนผู้ใช้ใหม่
export const registerUser = async (studentId, fullName, email, password) => {
    // ตรวจสอบว่าผู้ใช้มีอยู่แล้ว
    const [existingUser] = await pool.execute(
        "SELECT * FROM users WHERE studentId = ? or email = ?",
        [studentId, email]
    );

    if (existingUser.length > 0) {
        const error = new Error("Student Id or Email already exists!");
        error.statusCode = 409;
        throw error;
    }

    // เข้ารหัส Password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // บันทึกผู้ใช้ใหม่
    const [result] = await pool.execute(
        "INSERT INTO users (studentId, fullName, email, password) VALUES(?, ?, ?, ?)",
        [studentId, fullName, email, hashedPassword]
    );

    // ดึงข้อมูลผู้ใช้ใหม่ที่สร้างขึ้น
    const [newUser] = await pool.execute(
        "SELECT id, studentId, fullName, email FROM users WHERE id = ?",
        [result.insertId]
    );

    return newUser[0];
};

// เข้าสู่ระบบ
export const authenticateUser = async (email, studentId, password) => {
    // ค้นหาผู้ใช้
    const [rows] = await pool.execute(
        "SELECT * FROM users WHERE studentId = ? or email = ?",
        [studentId || null, email || null]
    );

    const user = rows[0];

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

