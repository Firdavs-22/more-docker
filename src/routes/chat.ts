import {Router} from "express";
import { authMiddleware } from "@middlewares/auth"
import { userExistMiddleware} from "@middlewares/userExist";
import chat from "@controllers/chat";

const router = Router();

router.use(authMiddleware)
router.use(userExistMiddleware)

router.get<{}, any>("/", chat.getAll);
router.post<{}, any>("/", chat.create);
router.put<{}, any>("/:id", chat.update);
router.delete<{}, any>("/:id", chat.delete);

export default router;