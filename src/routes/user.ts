import {Router} from "express";
import {authMiddleware} from "@middlewares/auth";
import userController from "@controllers/user"
import {userExistMiddleware} from "@middlewares/userExist";
const router = Router();

router.use(authMiddleware);
router.use(userExistMiddleware)

router.get('/', userController.getUser);
router.put('/', userController.updateUser);
router.delete('/', userController.deleteUser);

export default router;