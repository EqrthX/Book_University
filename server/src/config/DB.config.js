import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '', // ใส่รหัสผ่าน DB ของคุณถ้ามี
    database: process.env.DB_NAME || 'book_university',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;