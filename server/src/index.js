import express from "express"
import cookieParser from "cookie-parser"

import userRouter from "./routers/user.route.js";
import homepageVerifyRouter from "./routers/homepageVerify.route.js"

import { verifyToken } from "./middleware/auth.middleware.js";
import { fileURLToPath } from "url";

import cors from "cors";
import pool from "./config/DB.config.js";
import path from "path";

const app = express()
const PORT = process.env.PORT || 5001;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}))


app.use("/uploads", express.static('uploads'));
app.use("/api/auth", userRouter)
app.use("/api",verifyToken, homepageVerifyRouter)

pool.getConnection()
    .then((connection) => {
        console.log("Database Connected!");
        connection.release();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port: ${PORT}`);
        })
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err)
    })
