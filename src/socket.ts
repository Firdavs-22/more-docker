import http from "node:http";
import { Server } from 'socket.io';
import logger from '@logger';
import socketAuth from "@middlewares/socketAuth";
import socketChatHandlers from "@socket/chat";
const initializeSocket = (server: http.Server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.use(socketAuth);

    io.on("connection", (socket) => {
        const user = socket.data.user;
        logger.info(`New client connected: ${socket.data.user.username}`);

        io.emit("userConnected", {
            id: user.id,
            username: user.username
        });

        socket.on("disconnect", () => {
            logger.info(`Client disconnected: ${socket.id}`);
            io.emit("userDisconnected", {
                id: user.id,
                username: user.username
            });
        });

        socket.on("message", (message) => {
            logger.info(`Message received: ${message}`);
            io.emit("message", message);
        });

        socketChatHandlers(io, socket);
    })

    return io;
}

export default initializeSocket;