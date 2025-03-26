import { Socket } from "socket.io";
import { verifyToken } from "@utils/jwt";
import cache from "@cache";
import logger from "@logger";
import UserModel from "@models/user";

const socketAuth = async (socket: Socket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return socket.emit("unauthorized");
    }

    try {
        const userCache = await cache.get(token);
        let user;
        if (!userCache) {
            user = await verifyToken(token);
            if (!user) {
                return socket.emit("unauthorized");
            }
            await cache.set(token, JSON.stringify(user), 60 * 60);
        } else {
            user = JSON.parse(userCache as string);
        }

        const existingUser = await UserModel.getById(user.id);
        if (!existingUser) {
            return socket.emit("unauthorized");
        }

        if (!existingUser.token) {
            return socket.emit("unauthorized");
        }

        socket.data.user = existingUser;
        next();
    } catch (e) {
        logger.error("Socket Auth Middleware Error", e);
        next(new Error("Internal server error"));
    }
};

export default socketAuth;