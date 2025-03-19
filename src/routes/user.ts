import {Router} from "express";
import {authMiddleware} from "@middlewares/auth";
import userController from "@controllers/user"
const router = Router();

router.use(authMiddleware);
router.get('/', userController.getUser);
router.put('/', userController.updateUser);
router.delete('/', userController.deleteUser);

export default router;