import http from "http";
import { Server } from "socket.io";

import { createApp } from "./app.js";
import { PORT, socketCorsOptions } from "./config/app.config.js";
import pool from "./config/DB.config.js";
import { registerChatSocket } from "./socket/chat.socket.js";

const app = createApp();
const server = http.createServer(app);
const io = new Server(server, {
    cors: socketCorsOptions,
});

registerChatSocket(io);

pool.getConnection()
    .then((connection) => {
        console.log("Database Connected!");
        connection.release();
        server.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });
