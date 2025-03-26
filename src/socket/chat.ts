import {Server, Socket} from "socket.io";
import chatModel from "@models/chat";
import logger from "@logger";

const socketChatHandlers = (io: Server, socket: Socket) => {
    socket.on("sendMessage", async (message) => {
        try {
            const user = socket.data.user;
            if (!user) {
                return socket.emit("unauthorized");
            }

            if (!message || message.trim() === "") {
                return socket.emit("error", "Message is required");
            }

            const chat = await chatModel.create({
                user_id: user.id,
                message: message
            })
            if (!chat) {
                return socket.emit("error", "Internal Server Error");
            }

            const send = {
                id: chat.id,
                message: chat.message,
                user_id: chat.user_id,
                created_at: chat.created_at,
                updated_at: chat.updated_at,
                username: user.username
            }

            io.emit("newMessage", send);
        } catch (e) {
            logger.error("Socket Error sending message", e);
            socket.emit("error", "Internal Server Error");
        }
    })

    socket.on("getAllMessages", async () => {
        try {
            const chats = await chatModel.getAllWithUsername();
            socket.emit("allMessages", chats);
        } catch (error) {
            logger.error("Error fetching messages", error);
            socket.emit("error", "Internal server error");
        }
    });
}

export default socketChatHandlers;