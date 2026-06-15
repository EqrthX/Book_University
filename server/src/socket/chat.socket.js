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

export const registerChatSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        socket.on("register_user", (userId) => {
            if (!userId) {
                console.log("register_user failed: userId is undefined");
                return;
            }

            connectedUsers[userId] = socket.id;
            console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
            console.log("Current users:", connectedUsers);
        });

        socket.on("send_message", (message) => {
            console.log("Message received:", message);

            const receiverSocketId = connectedUsers[message.receiver];
            if (!receiverSocketId) {
                console.log(`Receiver not connected or not registered. Receiver ID: ${message.receiver}`);
                console.log("Current users:", connectedUsers);
                return;
            }

            if (message.picture && message.picture !== "uploaded") {
                console.warn("Picture data is not a valid URL. Ensure it is uploaded.");
            }

            io.to(receiverSocketId).emit("receive_message", message);
        });

        socket.on("error", (err) => {
            console.error("Socket error:", err);
        });

        socket.on("disconnect", () => {
            const disconnectedUserId = removeUserBySocketId(socket.id);
            console.log("Client disconnected:", socket.id);

            if (disconnectedUserId) {
                console.log(`User ${disconnectedUserId} disconnected and removed.`);
            }

            console.log("Current users after disconnect:", connectedUsers);
        });
    });
};
