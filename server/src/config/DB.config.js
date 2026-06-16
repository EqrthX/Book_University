import dotenv from "dotenv";
import mysql from "mysql2/promise";
import fs from "fs";

dotenv.config();

const dbHost = process.env.DB_HOST?.trim();
const dbPort = parseInt(process.env.DB_PORT, 10); 
const dbUser = process.env.DB_USER?.trim();
const dbPassword = process.env.DB_PASSWORD; 
const dbName = process.env.DB_NAME?.trim();

// อ่าน SSL CA จาก Environment Variable (Production/Railway)
// หรือจากไฟล์ ca.pem (Local Development)
const getSslCa = () => {
    if (process.env.DB_SSL_CA) {
        return Buffer.from(process.env.DB_SSL_CA, "base64").toString("utf-8");
    }
    if (fs.existsSync("./ca.pem")) {
        return fs.readFileSync("./ca.pem");
    }
    return undefined;
};

const sslCa = getSslCa();

const pool = mysql.createPool({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: sslCa ? { ca: sslCa } : undefined
});

export default pool;