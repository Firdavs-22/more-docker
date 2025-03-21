import {Router} from "express";
import { authMiddleware } from "@middlewares/auth"
import todo from "@controllers/todo";
import {userExistMiddleware} from "@middlewares/userExist";

const router = Router();

router.use(authMiddleware)
router.use(userExistMiddleware)

router.get<{}, any>("/", todo.getAll);
router.get<any, any>("/:id", todo.getOne);
router.post<any, any>("/", todo.create);
router.put<any, any>("/:id", todo.update);
router.patch<any, any>("/:id/complete", todo.complete)
router.delete<any, any>("/:id", todo.delete);

export default router;