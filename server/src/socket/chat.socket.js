const connectedUsers = {};

const removeUserBySocketId = (socketId) => {
    for (const userId in connectedUsers) {
        if (connectedUsers[userId] === socketId) {
            delete connectedUsers[userId];
            return userId;
        }
    }

    return null;
};

const emitOnlineUsers = (io) => {
    const onlineUserIds = Object.keys(connectedUsers).map((id) => Number(id));
    io.emit("get_online_users", onlineUserIds);
};

export const registerChatSocket = (io) => {
    io.on("connection", (socket) => {
        socket.on("register_user", (userId) => {
            if (!userId) {
                return;
            }

            connectedUsers[userId] = socket.id;
            emitOnlineUsers(io);
        });

        socket.on("send_message", (message) => {
            const receiverSocketId = connectedUsers[message.receiver];
            if (!receiverSocketId) {
                return;
            }

            io.to(receiverSocketId).emit("receive_message", message);
        });

        socket.on("error", (err) => {
            // Error ignored or handled elsewhere
        });

        socket.on("disconnect", () => {
            const disconnectedUserId = removeUserBySocketId(socket.id);
            if (disconnectedUserId) {
                emitOnlineUsers(io);
            }
        });
    });
};
