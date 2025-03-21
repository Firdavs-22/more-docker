import {Request, Response, NextFunction} from "express";
import {HttpStatus} from "@enums/httpStatus";
import {verifyToken} from "@utils/jwt";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
            message: "Unauthorized"
        }).end();
    }
    const token = authHeader.split("Bearer ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
            message: "Invalid token"
        }).end();
    }

    req.user = decoded;
    next();
}