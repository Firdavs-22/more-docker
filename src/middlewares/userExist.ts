import {Request, Response, NextFunction} from "express";
import {HttpStatus} from "@enums/httpStatus";
import UserModel from "@models/user";

export const userExistMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    if (!req.user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
            message: "Unauthorized"
        }).end();
    }

    const user = await UserModel.getById(req.user.id);
    if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
            message: "User does not exist"
        }).end();
    }

    req.user.username = user.username;

    next();
}