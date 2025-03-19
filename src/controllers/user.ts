import {Request, Response} from "express";
import logger from "@logger";
import {HttpStatus} from "@enums/httpStatus";
import UserModel, {User, UserResponse} from "@models/user";

class UserController {
    public userResponse = (user: User): UserResponse  =>{
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            created_at: user.created_at,
            updated_at: user.updated_at,
        }
    }

    public getUser = async (req: Request, res: Response): Promise<any> => {
        try {
            if (!req.user) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    message: "Unauthorized"
                }).end();
            }

            const user = await UserModel.getById(req.user.id);
            if (!user) {
                return res.status(HttpStatus.NOT_FOUND).end();
            }
            return res.status(HttpStatus.OK).json({
                message: "User retrieved successfully",
                user: this.userResponse(user)
            }).end();
        } catch (error) {
            logger.error("Error on get user", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error"
            }).end()
        }
    }

    public updateUser = async (req: Request, res: Response): Promise<any> => {
        try {
            if (!req.user) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    message: "Unauthorized"
                }).end();
            }
            const {username} = req.body;
            if (!username) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: "Username is required"
                }).end();
            }

            const user = await UserModel.update(req.user.id, {username});
            if (!user) {
                return res.status(HttpStatus.NOT_FOUND).end();
            }
            return res.status(HttpStatus.OK).json({
                message: "User updated successfully",
                user: this.userResponse(user)
            }).end();
        } catch (e) {
            logger.error("Error on updateUser", e);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error"
            }).end()
        }
    }

    public deleteUser = async (req: Request, res: Response): Promise<any> => {
        try {
            if (!req.user) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    message: "Unauthorized"
                }).end();
            }

            const user = await UserModel.getById(req.user.id);
            if (!user) {
                return res.status(HttpStatus.NOT_FOUND).end();
            }

            await UserModel.delete(req.user.id);
            return res.status(HttpStatus.NO_CONTENT).end();
        } catch (e) {
            logger.error("Error on deleteUser", e);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error"
            }).end()
        }
    }
}

const userController = new UserController();
export default userController;