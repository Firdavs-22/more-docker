import {Request, Response} from "express";
import logger from "@logger";
import {HttpStatus} from "@enums/httpStatus";
import UserModel, {User, UserResponse} from "@models/user";
import {hashPassword,comparePassword} from "@utils/password"
import {generateToken} from "@utils/jwt";
import cache from "@cache";

class AuthController {
    public userResponse = (user: User): UserResponse  =>{
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            created_at: user.created_at,
            updated_at: user.updated_at,
        }
    }

    public register = async (req: Request, res: Response): Promise<any>  =>{
        try {
            const {email, username, password} = req.body;

            if (!email || !username || !password) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: "Missing required fields"
                }).end();
            }

            const existUser = await UserModel.getByEmail(email);
            if (existUser) {
                return res.status(HttpStatus.CONFLICT).json({
                    message: "User already exists"
                }).end();
            }

            const hash_ = await hashPassword(password);
            const user = await UserModel.create({
                email,
                username,
                password: hash_
            });
            if (!user) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    message: "Error on create user"
                }).end();
            }
            const token = generateToken({
                id: user.id,
                email: user.email,
                username: user.username
            })

            await UserModel.login({
                user_id: user.id,
                token: token
            })

            await cache.set(token, JSON.stringify({
                id: user.id,
                email: user.email,
                username: user.username
            }), 60 * 60);

            res.status(HttpStatus.CREATED).json({
                message: "User created successfully",
                user: this.userResponse(user),
                token: token
            })
        } catch (error) {
            logger.error("Error on register user", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
        }
    }

    public login = async (req: Request, res: Response): Promise<any> => {
        try {
            const {email, password} = req.body;

            if (!email || !password) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: "Missing required fields"
                }).end();
            }

            const user = await UserModel.getByEmail(email);
            if (!user) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: "User not found"
                }).end();
            }

            const match = await comparePassword(password, user.password);
            if (!match) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    message: "Bad credentials"
                }).end();
            }

            const token = generateToken({
                id: user.id,
                email: user.email,
                username: user.username
            })

            await UserModel.login({
                user_id: user.id,
                token: token
            })

            await cache.set(token, JSON.stringify({
                id: user.id,
                email: user.email,
                username: user.username
            }), 60 * 60);

            res.status(HttpStatus.OK).json({
                message: "User logged in successfully",
                user: this.userResponse(user),
                token: token
            })
        } catch (error) {
            logger.error("Error on login user", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
        }
    }
}

const authController = new AuthController();
export default authController;