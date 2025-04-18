import express from "express"
import cookieParser from "cookie-parser"

import userRouter from "./routers/user.route.js";
import homepageVerifyRouter from "./routers/homepageVerify.route.js"
import productRouter from "./routers/product.route.js"
import adminRouter from "./routers/admin.route.js"
import cartRouter from "./routers/cart.route.js"
import paymentRouter from "./routers/payments.route.js"
import messagesRouter from "./routers/messages.route.js"
import notificationRouter from "./routers/notification.route.js"


import { verifyToken } from "./middleware/auth.middleware.js";

import cors from "cors";
import pool from "./config/DB.config.js";
import http from "http";
import { Server } from "socket.io";


const app = express()
const PORT = process.env.PORT || 5001;
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST"],
    },
})


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
app.use("/api/admin", verifyToken, adminRouter)

app.use("/api",verifyToken, homepageVerifyRouter)
app.use("/api/product", verifyToken, productRouter)
app.use("/api/cart", verifyToken, cartRouter)
app.use("/api/payment", verifyToken, paymentRouter)
app.use("/api/messages", verifyToken, messagesRouter)
app.use("/api/notifications", verifyToken, notificationRouter)
const users = {}; // เก็บ mapping ระหว่าง userId และ socketId

// scoket Logic
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // ลงทะเบียนผู้ใช้
    socket.on("register_user", (userId) => {
        if (userId) {
            console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
            users[userId] = socket.id; // เก็บ socket id ของ user
            console.log("Current users:", users); // แสดง users ที่ลงทะเบียนทั้งหมด
        } else {
            console.log("register_user failed: userId is undefined");
        }
    });

    // รับข้อความจาก client
    socket.on("send_message", (msg) => {
        console.log("Message received:", msg);

        const receiverSocketId = users[msg.receiver]; // หา socket id ของผู้รับ
        if (receiverSocketId) {
            console.log(`Sending message to receiver with socket ID: ${receiverSocketId}`);

            // ตรวจสอบว่ามีรูปภาพหรือไม่
            if (msg.picture && msg.picture !== "uploaded") {
                console.warn("Picture data is not a valid URL. Ensure it is uploaded.");
            }

            io.to(receiverSocketId).emit("receive_message", msg); // ส่งข้อความไปยังผู้รับ
        } else {
            console.log(`Receiver not connected or not registered. Receiver ID: ${msg.receiver}`);
            console.log("Current users:", users); // แสดง users ที่ลงทะเบียนทั้งหมด
        }
    });

    socket.on("error", (err) => {
        console.error("Socket error:", err);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
        for (const userId in users) {
            if (users[userId] === socket.id) {
                delete users[userId]; // ลบ socket id ของ user ออกจาก object
                console.log(`User ${userId} disconnected and removed.`);
                break;
            }
        }
        console.log("Current users after disconnect:", users); // แสดง users หลังจาก disconnect
    });
});

pool.getConnection()
    .then((connection) => {
        console.log("Database Connected!");
        connection.release();
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port: ${PORT}`);
        })
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err)
    })
