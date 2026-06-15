import dotenv from "dotenv";
import mysql from "mysql2/promise";
import fs from "fs";

dotenv.config();

const dbHost = process.env.DB_HOST?.trim();
const dbPort = parseInt(process.env.DB_PORT, 10); 
const dbUser = process.env.DB_USER?.trim();
const dbPassword = process.env.DB_PASSWORD; 
const dbName = process.env.DB_NAME?.trim();

const pool = mysql.createPool({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        ca: fs.readFileSync("./ca.pem") 
    }
});

export default pool;