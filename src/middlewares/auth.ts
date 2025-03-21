import {Request, Response, NextFunction} from "express";
import {HttpStatus} from "@enums/httpStatus";
import {verifyToken} from "@utils/jwt";
import logger from "@logger";
import cache from "@cache";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
            message: "Unauthorized"
        }).end();
    }

    try {
        const token = authHeader.split("Bearer ")[1];
        const userCache = await cache.get(token);
        let user;
        if (!userCache) {
            user = await verifyToken(token);
            if (!user) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    message: "Invalid token"
                }).end();
            }
            await cache.set(token, JSON.stringify(user), 60 * 60);
        } else {
            user = JSON.parse(userCache as string);
        }

        req.user = user;
        next();
    } catch (e) {
        logger.error('Auth Middleware Error', e);
        return res.status(500).json({ message: 'Internal server error' });
    }

}