import {Router} from "express";
import todo from "@controllers/todo";

const router = Router();

router.get<{}, any>("/", todo.getAll);

router.get<any, any>("/:id", todo.getOne);

router.post<any, any>("/", todo.create);

router.put<any, any>("/:id", todo.update);

router.patch<any, any>("/:id/complete", todo.complete)

router.delete<any, any>("/:id", todo.delete);

export default router;