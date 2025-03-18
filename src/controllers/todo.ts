import {Request, Response} from "express";
import TodoModel, {Todo, Todo as TodoType} from "@models/todo";
import logger from "@logger";
import {HttpStatus} from "@enums/httpStatus";

class TodoController {
    public async getAll(_req: Request, res: Response): Promise<any> {
        try {
            const todos: TodoType[] = await TodoModel.getAll();
            return res.status(HttpStatus.OK).json({
                message: "success",
                todos: todos
            }).end();
        } catch (e) {
            logger.error("Error in GET /todos", e);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "failed",
            }).end();
        }
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        try {
            if (!req.params.id || isNaN(Number(req.params.id))) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: "id is required",
                }).end();
            }
            const todo: TodoType | null = await TodoModel.getById(Number(req.params.id));
            if (!todo) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: "todo not found",
                }).end();
            }
            return res.status(HttpStatus.OK).json({
                message: "success",
                todo: todo
            }).end()
        } catch (e) {
            logger.error("Error in GET /todos/:id", e);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "failed",
            }).end();
        }
    }

    public async create(req: Request, res: Response): Promise<any> {
        try {
            if (!req.body.title) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: "title is required",
                }).end();
            } else if (!req.body.description) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: "description is required",
                }).end();
            }

            const newTodo: Todo | null = await TodoModel.create({
                title: req.body.title,
                description: req.body.description
            });

            if (!newTodo) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    message: "failed to create todo",
                }).end();
            }

            return res.status(HttpStatus.CREATED).json({
                message: "success",
                todo: newTodo
            }).end();
        } catch (e) {
            logger.error("Error in POST /todos", e);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "failed",
            }).end();
        }
    }

    public async update(req: Request, res: Response): Promise<any> {
        try {
            if (!req.params.id || isNaN(Number(req.params.id))) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: "id is required",
                }).end();
            } else if (!req.body.title) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: "title is required",
                }).end();
            } else if (!req.body.description) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: "description is required",
                }).end();
            } else if (req.body.completed === undefined) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: "completed is required",
                }).end();
            }

            const updatedTodo: Todo | null = await TodoModel.update(Number(req.params.id), {
                title: req.body.title,
                description: req.body.description,
                completed: req.body.completed
            });

            if (!updatedTodo) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: "todo not found",
                }).end();
            }

            return res.status(HttpStatus.OK).json({
                message: "success",
                todo: updatedTodo
            }).end();
        } catch (e) {
            logger.error("Error in PUT /todos/:id", e);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "failed",
            }).end();
        }
    }

    public async complete(req: Request, res: Response): Promise<any> {
        try {
            if (!req.params.id || isNaN(Number(req.params.id))) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: "id is required",
                }).end();
            }

            const completedTodo: Todo | null = await TodoModel.complete(Number(req.params.id));

            if (!completedTodo) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: "todo not found",
                }).end();
            }

            return res.status(HttpStatus.OK).json({
                message: "success",
                todo: completedTodo
            }).end();
        } catch (e) {
            logger.error("Error in PUT /todos/:id", e);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "failed",
            }).end();
        }
    }

    public async delete(req: Request, res: Response): Promise<any> {
        try {
            if (!req.params.id || isNaN(Number(req.params.id))) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: "id is required",
                }).end();

            }

            const todo: Todo | null = await TodoModel.getById(Number(req.params.id));
            if (!todo) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: "todo not found",
                }).end();
            }

            await TodoModel.delete(Number(req.params.id));

            return res.status(HttpStatus.NO_CONTENT).end();
        } catch (e) {
            logger.error("Error in DELETE /todos/:id", e);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "failed",
            }).end();
        }
    }
}

const todoController = new TodoController();
export default todoController;