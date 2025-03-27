import {Request, Response} from "express";
import logger from "@logger";
import {HttpStatus} from "@enums/httpStatus";
import ChatModel from "@models/chat";

class ChatController {
    public getAll = async (last_id: number = 0): Promise<any> => {
        if (last_id === 0) {
            return await ChatModel.getAllWithUsername()
        } else {
            return await ChatModel.getAllWithUsernamePaginated(last_id)
        }
    }

    public create = async (user_id: number, message: string): Promise<any> => {
        return await ChatModel.create({
            user_id: user_id,
            message: message,
        });
    }

    public update = async (req: Request, res: Response): Promise<any> => {
        try {
            if (!req.user) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    message: 'Unauthorized'
                }).end()
            }
            const {id} = req.params;
            const {message} = req.body;
            if (!message) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'Message is required'
                }).end();
            }

            const chatExist = await ChatModel.getById(Number(id), req.user.id);
            if (!chatExist) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: 'Chat not found'
                }).end();
            }

            const chat = await ChatModel.update(Number(id), {
                user_id: req.user.id,
                message: message,
            });

            if (!chat) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: 'Chat not found'
                }).end();
            }

            return res.status(HttpStatus.OK).json({
                message: 'Success',
                chat: chat
            }).end();
        } catch (error) {
            logger.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
        }
    }

    public delete = async (req: Request, res: Response): Promise<any> => {
        try {
            if (!req.user) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    message: 'Unauthorized'
                }).end()
            }
            const {id} = req.params;

            const chatExist = await ChatModel.getById(Number(id), req.user.id);
            if (!chatExist) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: 'Chat not found'
                }).end();
            }

            await ChatModel.delete(Number(id), req.user.id);

            return res.status(HttpStatus.NO_CONTENT).end();
        } catch (error) {
            logger.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
        }
    }
}

const chatController = new ChatController();
export default chatController;