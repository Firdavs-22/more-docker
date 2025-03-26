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
        logger.info(`New client connected: ${socket.id}`);

        socket.on("disconnect", () => {
            logger.info(`Client disconnected: ${socket.id}`);
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