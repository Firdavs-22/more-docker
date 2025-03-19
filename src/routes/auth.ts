import {Router} from "express";
import authController from "@controllers/auth"

const router = Router();

router.post<any,any>("/register", authController.register);
router.post<any,any>("/login", authController.login);

export default router;