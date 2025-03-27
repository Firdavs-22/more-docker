import {Server, Socket} from "socket.io";
import chatController from "@controllers/chat";
import logger from "@logger";

const socketChatHandlers = (io: Server, socket: Socket) => {
    socket.on("sendMessage", async (message: string) => {
        try {
            const user = socket.data.user;
            if (!user) {
                return socket.emit("unauthorized");
            }

            if (!message || message.trim() === "") {
                return socket.emit("error", "Message is required");
            }

            const chat = await chatController.create(user.id, message);
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
            const chats = await chatController.getAll();
            socket.emit("allMessages", chats);
        } catch (error) {
            logger.error("Error fetching messages", error);
            socket.emit("error", "Internal server error");
        }
    });

    socket.on("nextMessages", async (last_id: number) => {
        try {
            const chats = await chatController.getAll(last_id)
            socket.emit("nextMessages", chats);
        } catch (error) {
            logger.error("Error fetching messages paginate", error);
            socket.emit("error", "Internal server error");
        }
    })

    socket.on("deleteMessage", async (message_id: number) => {
        try {
            const user = socket.data.user;
            if (!user) {
                return socket.emit("unauthorized");
            }

            const chat = await chatController.getById(message_id);
            if (!chat) {
                io.emit("messageDeleted", message_id);
                return socket.emit("error", "Message not found");
            }
            if (chat.user_id !== user.id) {
                return socket.emit("error", "Unauthorized");
            }


            await chatController.delete(user.id, message_id);
            io.emit("messageDeleted", message_id);
        } catch (e) {
            logger.error("Error deleting message", e);
            socket.emit("error", "Internal Server Error");
        }
    })
}

export default socketChatHandlers;