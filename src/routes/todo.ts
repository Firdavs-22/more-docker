import {Router,Request,Response,} from "express";
import TodoModel,{Todo} from "../models/todo";
import {HttpStatus} from "../enums/httpStatus"

const router = Router();

router.get("/", async (_req:Request,res:Response) => {
    try {
        const todos:Todo[] = await TodoModel.getAll();
        res.status(HttpStatus.OK).json({
            message: "success",
            todos: todos
        }).end();
        return;
    } catch (e) {
        console.error("Error in GET /todos", e);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: "failed",
        }).end();
        return;
    }
});

router.get("/:id", async (req:Request,res:Response) => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "id is required",
            }).end();
            return;
        }
        const todo: Todo|null = await TodoModel.getById(Number(req.params.id));
        if (!todo) {
            res.status(HttpStatus.NOT_FOUND).json({
                message: "todo not found",
            }).end();
            return;
        }
        res.status(HttpStatus.OK).json({
            message: "success",
            todo: todo
        }).end()
        return;
    } catch (e) {
        console.error("Error in GET /todos/:id", e);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: "failed",
        }).end();
    }
})

router.post("/", async (req:Request,res:Response) => {
    try {
        if (!req.body.title) {
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "title is required",
            }).end();
            return;
        } else if (!req.body.description) {
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "description is required",
            }).end();
            return;
        }

        const newTodo:Todo | null = await TodoModel.create({
            title: req.body.title,
            description: req.body.description
        });

        if (!newTodo)  {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "failed to create todo",
            }).end();
            return;
        }

        res.status(HttpStatus.CREATED).json({
            message: "success",
            todo: newTodo
        }).end();
        return;
    } catch (e) {
        console.error("Error in POST /todos", e);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: "failed",
        }).end();
        return
    }
});

router.put("/:id", async (req:Request,res:Response) => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "id is required",
            }).end();
            return;
        } else if (!req.body.title) {
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "title is required",
            }).end();
            return;
        } else if (!req.body.description) {
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "description is required",
            }).end();
            return;
        } else if (req.body.completed === undefined) {
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "completed is required",
            }).end();
        }

        const updatedTodo:Todo | null = await TodoModel.update(Number(req.params.id),{
            title: req.body.title,
            description: req.body.description,
            completed: req.body.completed
        });

        if (!updatedTodo) {
            res.status(HttpStatus.NOT_FOUND).json({
                message: "todo not found",
            }).end();
            return;
        }

        res.status(HttpStatus.OK).json({
            message: "success",
            todo: updatedTodo
        }).end();
        return;
    } catch (e) {
        console.error("Error in PUT /todos/:id", e);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: "failed",
        }).end();
        return;
    }
});

router.patch("/:id/complete", async (req:Request,res:Response) => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "id is required",
            }).end();
            return;
        }

        const completedTodo:Todo | null = await TodoModel.complete(Number(req.params.id));

        if (!completedTodo) {
            res.status(HttpStatus.NOT_FOUND).json({
                message: "todo not found",
            }).end();
            return;
        }

        res.status(HttpStatus.OK).json({
            message: "success",
            todo: completedTodo
        }).end();
        return;
    } catch (e) {
        console.error("Error in PUT /todos/:id", e);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: "failed",
        }).end();
        return;
    }
})

router.delete("/:id", async (req:Request,res:Response) => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "id is required",
            }).end();
            return;
        }

        const todo:Todo | null = await TodoModel.getById(Number(req.params.id));
        if (!todo) {
            res.status(HttpStatus.NOT_FOUND).json({
                message: "todo not found",
            }).end();
            return;
        }

        await TodoModel.delete(Number(req.params.id));

        res.status(HttpStatus.NO_CONTENT).end();
        return;
    } catch (e) {
        console.error("Error in DELETE /todos/:id", e);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: "failed",
        }).end();
        return;
    }
});

export default router;